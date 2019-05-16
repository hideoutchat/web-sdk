// eslint-disable-next-line no-div-regex
export default (value) => value.replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/g, '');
