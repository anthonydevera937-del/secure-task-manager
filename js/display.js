export function updateTaskCounts(taskList, countElements) {
  const taskItems = [...taskList.querySelectorAll(".task-item")];

  const total = taskItems.length;
  const completed = taskItems.filter(
    (taskItem) => taskItem.dataset.state === "completed"
  ).length;
  const pending = taskItems.filter(
    (taskItem) => taskItem.dataset.state === "pending"
  ).length;

  countElements.total.textContent = String(total);
  countElements.pending.textContent = String(pending);
  countElements.completed.textContent = String(completed);
}