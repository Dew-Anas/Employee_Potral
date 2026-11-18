// TODO: Same rule as client/src/utils/validators.js. Keep both in sync.

const EMAIL_RE =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(value) {
  const email = normalizeEmail(value);
  if (!email || email.length > 254) return false;
  if (email.includes("..")) return false;
  return EMAIL_RE.test(email);
}

module.exports = { normalizeEmail, isValidEmail };