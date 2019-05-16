import encodeString from '../../encoding/encode-string';

const AES_GCM_STRENGTH = 256;
const AES_GCM = 'AES-GCM';
const ENCRYPT_DECRYPT = Object.freeze(['decrypt', 'encrypt']);
const AES_GCM_256 = Object.freeze({ length: AES_GCM_STRENGTH, name: AES_GCM });
const PBKDF2 = { hash: 'SHA-512', iterations: 1000000, name: 'PBKDF2' };
const DERIVE_KEY = Object.freeze(['deriveBits', 'deriveKey']);

const MINIMUM_SALT_LENGTH = 16;

const saltify = (value, length = MINIMUM_SALT_LENGTH) => {
  const valueAsArray = encodeString(value);
  const salt = new Uint8Array(Math.max(length, valueAsArray.length));
  const n = Math.min(salt.length, valueAsArray.length);
  for (let i = 0; i < n; i++) {
    salt[i] = valueAsArray[i];
  }
  return salt;
};

export default async ({ passphrase, username }) => {
  const passphraseAsKey = await crypto.subtle.importKey('raw', encodeString(passphrase), PBKDF2, false, DERIVE_KEY);
  const salt = saltify(username);
  const masterKey = await crypto.subtle.deriveKey({ ...PBKDF2, salt }, passphraseAsKey, AES_GCM_256, true, ENCRYPT_DECRYPT);
  return masterKey;
};
