import random from '../random';

const AES_GCM_IV_LENGTH = 12;
const AES_GCM = 'AES-GCM';

export default async ({ key, plaintext }) => {
  const iv = random(AES_GCM_IV_LENGTH);
  const ciphertext = await crypto.subtle.encrypt({ iv, name: AES_GCM }, key, plaintext);

  return { ciphertext, iv };
};
