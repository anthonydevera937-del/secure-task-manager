/* DISPLAY MODULE: element references and everything that updates what the user sees. */

export const elements = {
  taskInput: document.getElementById("taskInput"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  loadSamplesBtn: document.getElementById("loadSamplesBtn"),
  taskList: document.getElementById("taskList"),
  taskMessage: document.getElementById("taskMessage"),
  totalCount: document.getElementById("totalCount"),
  pendingCount: document.getElementById("pendingCount"),
  completedCount: document.getElementById("completedCount")
};

export function showMessage(text) {
  elements.taskMessage.textContent = text;
}

export function clearMessage() {
  elements.taskMessage.textContent = "";
}

export function clearInput() {
  elements.taskInput.value = "";
}

export function renderCounts({ total, pending, completed }) {
  elements.totalCount.textContent = total;
  elements.pendingCount.textContent = pending;
  elements.completedCount.textContent = completed;
}
