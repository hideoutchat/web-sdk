import { Buffer } from 'buffer';

export default (value) => Buffer.from(value, 'base64');
