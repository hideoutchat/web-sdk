import deriveKeyId from '../derive-key-id';

export default async (key) => {
  const { kid: actual } = key;
  const expected = await deriveKeyId(key);

  if (actual !== expected) {
    throw new Error(`JWK key ID does not match expected value. (expected: "${expected}", actual: "${actual}")`);
  }
};
