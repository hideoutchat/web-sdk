import bufferToBase64 from '../../encoding/buffer-to-base64';
import normalizeBase64 from '../../encoding/normalize-base64';
import random from '../random';

export default () => normalizeBase64(bufferToBase64(random()));
