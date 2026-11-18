// TODO: Same rule as server/src/utils/validators.js. Keep both in sync.

const EMAIL_RE =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function isValidEmail(value) {
  const email = normalizeEmail(value);
  if (!email || email.length > 254) return false;
  if (email.includes("..")) return false;
  return EMAIL_RE.test(email);
}

// Returns an error message, or "" when the email is valid.
export function emailError(value) {
  const email = normalizeEmail(value);
  if (!email) return "Email is required.";
  if (!isValidEmail(email)) return "Enter a valid email, e.g. name@example.com";
  return "";
}