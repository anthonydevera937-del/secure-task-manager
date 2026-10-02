/* DISPLAY MODULE: everything that changes what the user sees.
   The page elements are selected in app.js and passed in as arguments. */

export function showMessage(messageElement, text) {
  messageElement.textContent = text;
}

export function clearMessage(messageElement) {
  messageElement.textContent = "";
}

export function clearInput(inputElement) {
  inputElement.value = "";
}

export function renderCounts(countElements, { total, pending, completed }) {
  countElements.total.textContent = total;
  countElements.pending.textContent = pending;
  countElements.completed.textContent = completed;
}
