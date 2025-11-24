const crypto = require('crypto');

const now = () => new Date();
const genId = () => (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));
const toISO = (d) => d.toISOString();
const omit = (obj, keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

module.exports = { now, genId, toISO, omit };