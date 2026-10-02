/* MAIN MODULE: builds tasks, handles events, and connects the other modules. */
import { SAMPLE_TASKS, generateTaskId, calculateCounts } from "./data.js";
import { normalizeText, isBlank } from "./utils.js";
import { showMessage, clearMessage, clearInput, renderCounts } from "./display.js";

/* ---------- Select and store the page elements ---------- */
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const EMPTY_MESSAGE = "Task cannot be empty";
const countElements = { total: totalCount, pending: pendingCount, completed: completedCount };

function createTaskId() {
  return generateTaskId((id) => taskList.querySelector(`[data-task-id="${id}"]`) !== null);
}

/* ---------- Required functions ---------- */

// Creates and returns one task <li>. It does NOT attach it to #taskList.
function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.type = "button";
  completeBtn.classList.add("complete-btn");
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "Remove";

  taskItem.append(textSpan, completeBtn, editBtn, removeBtn);
  return taskItem;
}

function addTask(taskText = taskInput.value) {
  if (isBlank(taskText)) {
    showMessage(taskMessage, EMPTY_MESSAGE);
    return;
  }

  const taskItem = createTaskElement(normalizeText(taskText), createTaskId());
  taskList.appendChild(taskItem);

  clearInput(taskInput);
  clearMessage(taskMessage);
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  const editButton = taskItem.querySelector(".edit-btn");
  if (!textSpan || !editButton) {
    return;
  }

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;

  taskItem.replaceChild(editInput, textSpan);
  editButton.textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const editButton = taskItem.querySelector(".edit-btn");
  if (!editInput || !editButton) {
    return;
  }

  if (isBlank(editInput.value)) {
    showMessage(taskMessage, EMPTY_MESSAGE);
    return;
  }

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = normalizeText(editInput.value);

  taskItem.replaceChild(textSpan, editInput);
  editButton.textContent = "Edit";
  clearMessage(taskMessage);
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

// Reads the current DOM, calculates the counts, then displays them.
function updateTaskCounts() {
  const states = Array.from(taskList.querySelectorAll(".task-item")).map(
    (taskItem) => taskItem.dataset.state
  );
  renderCounts(countElements, calculateCounts(states));
}

// The single delegated click handler attached to #taskList.
function handleTaskListClick(event) {
  const taskItem = event.target.closest(".task-item");

  if (!taskItem || !taskList.contains(taskItem)) {
    return;
  }

  if (event.target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (event.target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (event.target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();

  SAMPLE_TASKS.forEach((sampleText) => {
    fragment.appendChild(createTaskElement(sampleText, createTaskId()));
  });

  taskList.appendChild(fragment); // appended to the live DOM only once
  clearMessage(taskMessage);
  updateTaskCounts();
}

/* ---------- Event listeners ---------- */
taskList.addEventListener("click", handleTaskListClick);
addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});
loadSamplesBtn.addEventListener("click", loadSampleTasks);

// Modules are not global by default, so expose the required functions for grading/testing.
Object.assign(window, {
  createTaskElement,
  addTask,
  toggleTaskComplete,
  beginTaskEdit,
  saveTaskEdit,
  removeTask,
  updateTaskCounts,
  handleTaskListClick,
  loadSampleTasks
});

updateTaskCounts();
