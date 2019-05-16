export default (privateKey) => {
  const publicKey = { ...privateKey };

  delete publicKey.d;
  delete publicKey.ext;
  delete publicKey.key_ops;

  return publicKey;
};
