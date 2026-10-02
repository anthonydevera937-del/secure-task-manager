/* UTILITY MODULE: small reusable helpers that do not touch the page. */

export function normalizeText(text) {
  return String(text).trim();
}

export function isBlank(text) {
  return normalizeText(text) === "";
}
