import bufferToBase64 from '../../utilities/encoding/buffer-to-base64';
import encodeJson from '../../utilities/encoding/encode-json';
import signMessage from '../../utilities/cryptography/sign-message';

export default ({ privateKey }) => async (event = {}) => ({
  ...event,
  signature: bufferToBase64(await signMessage({
    message: encodeJson(event),
    privateKey
  })),
  signingKeyId: privateKey.kid
});
