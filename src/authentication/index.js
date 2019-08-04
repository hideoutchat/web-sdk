import createSign from './sign';
import createVerify from './verify';
import generateId from '../utilities/cryptography/generate-id';
import toPublicKey from '../utilities/cryptography/to-public-key';
import verifyPublicKey from '../utilities/cryptography/verify-public-key';

const CHALLENGE_RESPONSE_TIMEOUT = 10000;

const Authentication = function Authentication(nextProtocol) {
  this.connect = ({ onConnect, onDisconnect, onError, onPublicKey, privateKey, url }) => {
    const sign = createSign({ privateKey });
    const publicKey = toPublicKey(privateKey);

    nextProtocol.connect({
      // eslint-disable-next-line max-statements
      onConnect: (nextProtocol) => {
        const state = {
          challenges: {},
          keyStore: {}
        };

        const signAndPublish = async (type, event) => nextProtocol.publish(type, await sign(event));
        const verify = createVerify({ keyStore: state.keyStore });

        const challenge = (signingKeyId) => new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Challenge response timed out.')), CHALLENGE_RESPONSE_TIMEOUT);
          const challenge = { id: generateId(), publicKeyId: signingKeyId };

          nextProtocol.subscribe({
            challengeResponse: {
              challengeId: challenge.id,
              signingKey: {
                kid: challenge.publicKeyId
              }
            },
            type: 'challengeResponse'
          // eslint-disable-next-line max-statements
          }, async (envelope) => {
            const { [envelope.type]: event } = envelope;
            clearTimeout(timeout);

            const { signingKey } = event;

            try {
              await verifyPublicKey(signingKey);
            } catch (error) {
              reject(error);
              return;
            }

            try {
              state.keyStore[signingKey.kid] = signingKey;
              await verify(event);
            } catch (error) {
              delete state.keyStore[signingKey.kid];
              reject(error);
              return;
            }

            onPublicKey(signingKey);
            resolve(signingKey);
          });

          signAndPublish('challenge', challenge);
        });

        const withVerification = (onEvent) => async (envelope) => {
          const { [envelope.type]: event } = envelope;
          try {
            await verify(event);
          } catch (error) {
            if (!state.challenges[event.signingKeyId]) {
              state.challenges[event.signingKeyId] = challenge(event.signingKeyId);
            }

            await state.challenges[event.signingKeyId];
          }

          onEvent(event);
        };

        const subscribeAndVerify = (shape, onEvent) => nextProtocol.subscribe(shape, withVerification(onEvent));

        nextProtocol.subscribe({
          challenge: {
            publicKeyId: publicKey.kid
          },
          type: 'challenge'
        }, (event) => {
          if (event.challenge.id) {
            signAndPublish('challengeResponse', {
              challengeId: event.challenge.id,
              signingKey: publicKey
            });
          }
        });

        onConnect({
          publish: signAndPublish,
          subscribe: subscribeAndVerify,
          unsubscribe: nextProtocol.unsubscribe
        });
      },
      onDisconnect,
      onError,
      url
    });
  };

  return this;
};

export default Authentication;
