const AES_GCM = 'AES-GCM';

export default async ({ ciphertext, iv, key }) => {
  const plaintext = await crypto.subtle.decrypt({ iv, name: AES_GCM }, key, ciphertext);
  return plaintext;
};
