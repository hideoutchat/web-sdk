import importKey from '../import-key';

const AES_GCM_STRENGTH = 256;
const ECDH = 'ECDH';
const AES_GCM = 'AES-GCM';
const ENCRYPT_DECRYPT = Object.freeze(['decrypt', 'encrypt']);
const AES_GCM_256 = Object.freeze({ length: AES_GCM_STRENGTH, name: AES_GCM });

export default async ({ privateKey, publicKey }) => {
  const key = await crypto.subtle.deriveKey({
    name: ECDH,
    // eslint-disable-next-line camelcase
    public: await importKey({ ...publicKey, key_ops: [] })
  }, await importKey(privateKey), AES_GCM_256, false, ENCRYPT_DECRYPT);

  return key;
};
