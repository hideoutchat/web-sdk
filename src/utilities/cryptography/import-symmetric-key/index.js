const AES_GCM_STRENGTH = 256;
const AES_GCM = 'AES-GCM';
const ENCRYPT_DECRYPT = Object.freeze(['decrypt', 'encrypt']);
const JWK = 'jwk';
const AES_GCM_256 = Object.freeze({ length: AES_GCM_STRENGTH, name: AES_GCM });

// eslint-disable-next-line camelcase
export default (key) => crypto.subtle.importKey(JWK, { ...key, key_ops: ENCRYPT_DECRYPT }, AES_GCM_256, true, ENCRYPT_DECRYPT);
