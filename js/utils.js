export const sampleTasks = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

let nextTaskNumber = 1;

export function createTaskId() {
  return `task-${nextTaskNumber++}`;
}