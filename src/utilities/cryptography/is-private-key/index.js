const JWK_TYPE_EC_KEY = 'EC';

export default (key) => key.kty === JWK_TYPE_EC_KEY && Boolean(key.d);
