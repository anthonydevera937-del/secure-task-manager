import { sampleTasks, createTaskId } from "./data.js";
import { isBlank } from "./utils.js";
import { updateTaskCounts } from "./display.js";

const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const loadSamplesBtn = document.querySelector("#loadSamplesBtn");
const taskList = document.querySelector("#taskList");
const taskMessage = document.querySelector("#taskMessage");

const countElements = {
  total: document.querySelector("#totalCount"),
  pending: document.querySelector("#pendingCount"),
  completed: document.querySelector("#completedCount")
};

function showMessage(message = "") {
  taskMessage.textContent = message;
}

function createActionButton(className, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(className);
  button.textContent = label;
  return button;
}

function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  const text = document.createElement("span");
  text.classList.add("task-text");
  text.textContent = taskText;

  taskItem.append(
    text,
    createActionButton("complete-btn", "Complete"),
    createActionButton("edit-btn", "Edit"),
    createActionButton("remove-btn", "Remove")
  );

  return taskItem;
}

function addTask(taskText) {
  if (isBlank(taskText)) {
    showMessage("Task cannot be empty");
    return false;
  }

  const taskItem = createTaskElement(taskText.trim(), createTaskId());
  taskList.append(taskItem);
  taskInput.value = "";
  showMessage();
  updateTaskCounts(taskList, countElements);
  return true;
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts(taskList, countElements);
}

function beginTaskEdit(taskItem) {
  const textElement = taskItem.querySelector(".task-text");
  const editButton = taskItem.querySelector(".edit-btn");

  if (!textElement || !editButton) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textElement.textContent;

  textElement.replaceWith(editInput);
  editButton.textContent = "Save";
  editInput.focus();
  editInput.select();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const editButton = taskItem.querySelector(".edit-btn");

  if (!editInput || !editButton) return;

  if (isBlank(editInput.value)) {
    showMessage("Task cannot be empty");
    editInput.focus();
    return;
  }

  const textElement = document.createElement("span");
  textElement.classList.add("task-text");
  textElement.textContent = editInput.value.trim();

  editInput.replaceWith(textElement);
  editButton.textContent = "Edit";
  showMessage();
}

function removeTask(taskItem) {
  taskItem.remove();
  showMessage();
  updateTaskCounts(taskList, countElements);
}

function handleTaskListClick(event) {
  if (!(event.target instanceof Element)) return;

  const actionButton = event.target.closest("button");
  if (!actionButton || !taskList.contains(actionButton)) return;

  const taskItem = actionButton.closest(".task-item");
  if (!taskItem) return;

  if (actionButton.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (actionButton.matches(".edit-btn")) {
    if (actionButton.textContent === "Save") {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (actionButton.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const fragment = document.createDocumentFragment();

  sampleTasks.forEach((taskText) => {
    fragment.append(createTaskElement(taskText, createTaskId()));
  });

  taskList.append(fragment);
  showMessage();
  updateTaskCounts(taskList, countElements);
}

addTaskBtn.addEventListener("click", () => {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskList.addEventListener("click", handleTaskListClick);

updateTaskCounts(taskList, countElements);