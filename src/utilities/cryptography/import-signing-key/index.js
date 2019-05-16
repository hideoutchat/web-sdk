import isPrivateKey from '../is-private-key';
import toPublicKey from '../to-public-key';

const P384 = 'P-384';
const ECDSA = 'ECDSA';
const SIGN = Object.freeze(['sign']);
const VERIFY = Object.freeze(['verify']);
const JWK = 'jwk';
const ECDSA_P384 = Object.freeze({ name: ECDSA, namedCurve: P384 });

export default (key) => {
  if (isPrivateKey(key)) {
    // eslint-disable-next-line camelcase
    return crypto.subtle.importKey(JWK, { ...key, key_ops: SIGN }, ECDSA_P384, true, SIGN);
  }

  // eslint-disable-next-line camelcase
  return crypto.subtle.importKey(JWK, { ...toPublicKey(key), key_ops: VERIFY }, ECDSA_P384, true, VERIFY);
};
