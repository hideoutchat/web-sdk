const JWK_TYPE_SYMMETRIC_KEY = 'oct';

export default (key) => key.kty === JWK_TYPE_SYMMETRIC_KEY;
