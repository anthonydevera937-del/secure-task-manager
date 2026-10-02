"use strict";

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const loadSamplesBtn = document.querySelector("#loadSamplesBtn");
const taskList = document.querySelector("#taskList");
const taskMessage = document.querySelector("#taskMessage");
const totalCount = document.querySelector("#totalCount");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");

let nextTaskId = 1;

function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  const completeButton = document.createElement("button");
  completeButton.classList.add("complete-btn");
  completeButton.type = "button";
  completeButton.textContent = "Complete";

  const editButton = document.createElement("button");
  editButton.classList.add("edit-btn");
  editButton.type = "button";
  editButton.textContent = "Edit";

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-btn");
  removeButton.type = "button";
  removeButton.textContent = "Remove";

  taskItem.append(textSpan, completeButton, editButton, removeButton);
  return taskItem;
}

function addTask(taskText) {
  const trimmedText = taskText.trim();

  if (!trimmedText) {
    taskMessage.textContent = "Task cannot be empty";
    return false;
  }

  const taskId = `task-${nextTaskId}`;
  nextTaskId += 1;

  const taskItem = createTaskElement(trimmedText, taskId);
  taskList.appendChild(taskItem);

  taskInput.value = "";
  taskMessage.textContent = "";
  updateTaskCounts();

  return true;
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
  editInput.classList.add("edit-input");
  editInput.type = "text";
  editInput.value = textSpan.textContent;

  textSpan.replaceWith(editInput);
  editButton.textContent = "Save";
  editInput.focus();
  editInput.select();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const editButton = taskItem.querySelector(".edit-btn");

  if (!editInput || !editButton) {
    return;
  }

  const editedText = editInput.value.trim();

  if (!editedText) {
    taskMessage.textContent = "Task cannot be empty";
    editInput.focus();
    return;
  }

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = editedText;

  editInput.replaceWith(textSpan);
  editButton.textContent = "Edit";
  taskMessage.textContent = "";
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  const taskItems = Array.from(taskList.querySelectorAll(".task-item"));
  const completed = taskItems.filter(
    (taskItem) => taskItem.dataset.state === "completed"
  ).length;
  const pending = taskItems.filter(
    (taskItem) => taskItem.dataset.state === "pending"
  ).length;

  totalCount.textContent = String(taskItems.length);
  pendingCount.textContent = String(pending);
  completedCount.textContent = String(completed);
}

function handleTaskListClick(event) {
  const actionButton = event.target.closest(
    ".complete-btn, .edit-btn, .remove-btn"
  );

  if (!actionButton || !taskList.contains(actionButton)) {
    return;
  }

  const taskItem = event.target.closest(".task-item");

  if (!taskItem) {
    return;
  }

  if (actionButton.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
    return;
  }

  if (actionButton.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
    return;
  }

  if (actionButton.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const sampleTasks = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];
  const fragment = document.createDocumentFragment();

  sampleTasks.forEach((taskText) => {
    const taskId = `task-${nextTaskId}`;
    nextTaskId += 1;
    fragment.appendChild(createTaskElement(taskText, taskId));
  });

  taskList.appendChild(fragment);
  taskMessage.textContent = "";
  updateTaskCounts();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskList.addEventListener("click", handleTaskListClick);

// Keep the required button reference in use and prevent accidental form behavior.
addTaskBtn.type = "submit";

updateTaskCounts();