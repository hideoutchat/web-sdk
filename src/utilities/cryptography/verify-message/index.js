import importSigningKey from '../import-signing-key';

const ECDSA = 'ECDSA';
const SHA256 = 'SHA-256';
const ECDSA_SHA256 = Object.freeze({ hash: SHA256, name: ECDSA });

export default async ({ message, publicKey, signature }) => {
  const isVerified = await crypto.subtle.verify(ECDSA_SHA256, await importSigningKey(publicKey), signature, message);

  if (!isVerified) {
    throw new Error('Signature verification failed.');
  }
};
