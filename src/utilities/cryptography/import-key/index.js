import isPrivateKey from '../is-private-key';
import toPublicKey from '../to-public-key';

const P384 = 'P-384';
const ECDH = 'ECDH';
const DERIVE_KEY = Object.freeze(['deriveKey']);
const JWK = 'jwk';
const ECDH_P384 = Object.freeze({ name: ECDH, namedCurve: P384 });

export default (key) => {
  if (isPrivateKey(key)) {
    return crypto.subtle.importKey(JWK, key, ECDH_P384, true, DERIVE_KEY);
  }

  return crypto.subtle.importKey(JWK, toPublicKey(key), ECDH_P384, true, []);
};
