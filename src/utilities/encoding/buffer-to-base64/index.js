import { Buffer } from 'buffer';

export default (value) => {
  const buffer = Buffer.from(value);
  const bufferAsBase64 = buffer.toString('base64');
  return bufferAsBase64;
};
