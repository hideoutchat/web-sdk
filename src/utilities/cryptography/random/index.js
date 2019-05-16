const DEFAULT_RANDOM_LENGTH = 32;

export default (n = DEFAULT_RANDOM_LENGTH) => crypto.getRandomValues(new Uint8Array(n));
