import deriveKeyId from '../derive-key-id';
import toPublicKey from '../to-public-key';

const P384 = 'P-384';
const ECDH = 'ECDH';
const DERIVE_KEY = Object.freeze(['deriveKey']);
const JWK = 'jwk';
const ECDH_P384 = Object.freeze({ name: ECDH, namedCurve: P384 });

export default async () => {
  const { privateKey } = await crypto.subtle.generateKey(ECDH_P384, true, DERIVE_KEY);
  const jwk = await crypto.subtle.exportKey(JWK, privateKey);
  const id = await deriveKeyId(toPublicKey(jwk));

  jwk.kid = id;

  return jwk;
};
