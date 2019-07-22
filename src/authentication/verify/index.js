import base64ToBuffer from '../../utilities/encoding/base64-to-buffer';
import encodeJson from '../../utilities/encoding/encode-json';
import verifyMessage from '../../utilities/cryptography/verify-message';

export default ({ keyStore }) => async (event) => {
  const signedEvent = { ...event };

  delete signedEvent.signingKeyId;
  delete signedEvent.signature;

  const { [event.signingKeyId]: signingKey } = keyStore;

  if (!signingKey) {
    throw new Error(`Unknown public key: ${event.signingKeyId}`);
  }

  await verifyMessage({
    message: encodeJson(signedEvent),
    publicKey: signingKey,
    signature: base64ToBuffer(event.signature)
  });

  // eslint-disable-next-line require-atomic-updates
  event.signingKey = signingKey;

  return signingKey;
};
