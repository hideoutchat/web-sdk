import bufferToBase64 from '../../encoding/buffer-to-base64';
import normalizeBase64 from '../../encoding/normalize-base64';
import random from '../random';

const AES_GCM_STRENGTH = 256;
const AES_GCM = 'AES-GCM';
const ENCRYPT_DECRYPT = Object.freeze(['decrypt', 'encrypt']);
const JWK = 'jwk';
const AES_GCM_256 = Object.freeze({ length: AES_GCM_STRENGTH, name: AES_GCM });

export default async () => {
  const key = await crypto.subtle.generateKey(AES_GCM_256, true, ENCRYPT_DECRYPT);
  const jwk = await crypto.subtle.exportKey(JWK, key);

  jwk.kid = normalizeBase64(bufferToBase64(random()));

  return jwk;
};
