import importSigningKey from '../import-signing-key';

const ECDSA = 'ECDSA';
const SHA256 = 'SHA-256';
const ECDSA_SHA256 = Object.freeze({ hash: SHA256, name: ECDSA });

export default async ({ message, privateKey }) => {
  const key = await importSigningKey(privateKey);
  const signature = await crypto.subtle.sign(ECDSA_SHA256, key, message);

  return signature;
};
