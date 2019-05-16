const UTF8 = 'utf-8';

export default (value) => new TextDecoder(UTF8).decode(value);
