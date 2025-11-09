const crypto = require('crypto');

function getKey() {
  const secret = process.env.PASSWORD_ENC_SECRET || process.env.JWT_SECRET || 'default_secret_fallback';
  return crypto.createHash('sha256').update(secret).digest();
}

function encryptPlain(plainText) {
  if (!plainText && plainText !== '') return null;
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('base64'), enc.toString('base64'), tag.toString('base64')].join(':');
}

function decryptPlain(payload) {
  try {
    if (!payload) return null;
    const [ivB64, dataB64, tagB64] = String(payload).split(':');
    const key = getKey();
    const iv = Buffer.from(ivB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);
    return dec.toString('utf8');
  } catch {
    return null;
  }
}

module.exports = { encryptPlain, decryptPlain };
