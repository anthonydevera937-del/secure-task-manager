/* MAIN MODULE: builds tasks, handles events, and connects the other modules. */
import { EMPTY_MESSAGE, TASK_STATES, SAMPLE_TASKS, generateTaskId, calculateCounts } from "./data.js";
import { normalizeText, isBlank } from "./utils.js";
import { elements, showMessage, clearMessage, clearInput, renderCounts } from "./display.js";

const { taskInput, addTaskBtn, loadSamplesBtn, taskList } = elements;

function createTaskId() {
  return generateTaskId((id) => taskList.querySelector(`[data-task-id="${id}"]`) !== null);
}

/* ---------- Required functions ---------- */

// Creates and returns one task <li>. It does NOT attach it to #taskList.
function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = TASK_STATES.PENDING;

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

function addTask(taskText) {
  if (isBlank(taskText)) {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const taskItem = createTaskElement(normalizeText(taskText), createTaskId());
  taskList.appendChild(taskItem);

  clearInput();
  clearMessage();
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? TASK_STATES.COMPLETED : TASK_STATES.PENDING;
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
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = normalizeText(editInput.value);

  taskItem.replaceChild(textSpan, editInput);
  editButton.textContent = "Edit";
  clearMessage();
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
  renderCounts(calculateCounts(states));
}

// The single delegated click handler attached to #taskList.
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");

  if (!taskItem || !taskList.contains(taskItem)) {
    return;
  }

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();

  SAMPLE_TASKS.forEach((sampleText) => {
    fragment.appendChild(createTaskElement(sampleText, createTaskId()));
  });

  taskList.appendChild(fragment); // appended to the live DOM only once
  clearMessage();
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
