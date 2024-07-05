import base64url from 'base64url';
import jsonStableStringify from 'json-stable-stringify';
import blake2b from 'blake2b';

const _ensureBytes = (x) => {
  if (typeof x === 'string') {
    return Buffer.from(x, 'ascii');
  } else {
    return x;
  }
};

const b64Encode = (data) => {
  data = _ensureBytes(data);
  const encoded = base64url.encode(data);
  return encoded.replace(/=+$/, '');
};

const _PADDING_TABLE = ['', '===', '==', '='];

const b64Decode = (data) => {
  data = _ensureBytes(data);
  const padding = _PADDING_TABLE[data.length % 4];
  return base64url.decode(data + padding);
};

const kHash = (data) => {
  const hs = blake2b(32);
  hs.update(_ensureBytes(data));
  return hs.digest();
};

const kHashB64 = (data) => {
  return b64Encode(kHash(data));
};

const pactStringify = (obj) => {
  return jsonStableStringify(obj);
};

const genKeysetGuard = (pred, keys) => {
  return { pred, keys: keys.sort() };
};

const genSingleKeyGuard = (key) => {
  return genKeysetGuard('keys-all', [key]);
};

const createTokenId = (uri, guard) => {
  const hData = pactStringify({ g: guard, u: uri });
  return `t:${kHashB64(hData)}`;
};

const createTokenIdFromKey = (uri, creatorKey) => {
  return createTokenId(uri, genSingleKeyGuard(creatorKey));
};

const createCollectionId = (name, guard) => {
  const hData = pactStringify({ g: guard, n: name });
  return `c_${name}_${kHashB64(hData)}`;
};

const createCollectionIdFromKey = (name, creatorKey) => {
  return createCollectionId(name, genSingleKeyGuard(creatorKey));
};

export { createTokenIdFromKey, createCollectionIdFromKey }