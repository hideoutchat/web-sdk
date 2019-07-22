import base64ToBuffer from '../utilities/encoding/base64-to-buffer';
import bufferToBase64 from '../utilities/encoding/buffer-to-base64';
import decodeJson from '../utilities/encoding/decode-json';
import decryptMessage from '../utilities/cryptography/decrypt-message';
import dh from '../utilities/cryptography/dh';
import encodeJson from '../utilities/encoding/encode-json';
import encryptMessage from '../utilities/cryptography/encrypt-message';
import importSymmetricKey from '../utilities/cryptography/import-symmetric-key';
import toPublicKey from '../utilities/cryptography/to-public-key';

const encrypt = async (key, message) => {
  const { ciphertext, iv } = await encryptMessage({
    key,
    plaintext: encodeJson(message)
  });
  return {
    ciphertext: bufferToBase64(ciphertext),
    iv: bufferToBase64(iv)
  };
};

const decrypt = async (key, { ciphertext, iv }) => decodeJson(await decryptMessage({
  ciphertext: base64ToBuffer(ciphertext),
  iv: base64ToBuffer(iv),
  key
}));

const Confidentiality = function Confidentiality(nextProtocol) {
  this.connect = ({ onConnect, onDisconnect, onError, onPublicKey, privateKey, url }) => {
    const publicKey = toPublicKey(privateKey);

    nextProtocol.connect({
      onConnect: ({ publish, subscribe }) => {
        const onPeerEvent = (onEvent) => subscribe({
          private: { key: { id: publicKey.kid } },
          type: 'private'
        }, async (event) => {
          const { private: { payload: { ciphertext, iv } }, signingKey } = event;

          onEvent({
            ...event,
            private: await decrypt(await dh({ privateKey, publicKey: signingKey }), { ciphertext, iv })
          });
        });

        const sendPeerEvent = async (publicKey, event) => {
          publish('private', {
            key: { id: publicKey.kid },
            payload: await encrypt(await dh({ privateKey, publicKey }), event)
          });
        };

        const onGroupEvent = (symmetricKey, onEvent) => subscribe({
          private: { key: { id: symmetricKey.kid } },
          type: 'private'
        }, async (event) => {
          const { private: { payload: { ciphertext, iv } } } = event;

          onEvent({
            ...event,
            private: await decrypt(await importSymmetricKey(symmetricKey), { ciphertext, iv })
          });
        });

        const sendGroupEvent = async (symmetricKey, event) => {
          publish('private', {
            key: { id: symmetricKey.kid },
            payload: await encrypt(await importSymmetricKey(symmetricKey), event)
          });
        };

        const broadcast = publish;

        onConnect({
          broadcast,
          onGroupEvent,
          onPeerEvent,
          sendGroupEvent,
          sendPeerEvent
        });
      },
      onDisconnect,
      onError,
      onPublicKey,
      privateKey,
      url
    });
  };

  return this;
};

export default Confidentiality;
