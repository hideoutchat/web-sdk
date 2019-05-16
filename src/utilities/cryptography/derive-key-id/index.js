import bufferToBase64 from '../../encoding/buffer-to-base64';
import encodeJson from '../../encoding/encode-json';
import normalizeBase64 from '../../encoding/normalize-base64';

const SHA256 = 'SHA-256';

export default async (key) => {
  const normalizedKey = { ...key };

  delete normalizedKey.kid;
  delete normalizedKey.key_ops;
  delete normalizedKey.ext;

  const hashValue = await crypto.subtle.digest(SHA256, encodeJson(normalizedKey));

  return normalizeBase64(bufferToBase64(hashValue));
};
