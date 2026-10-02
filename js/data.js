/* DATA MODULE: constants, task state, ID generation, and count calculation. */

export const EMPTY_MESSAGE = "Task cannot be empty";

export const TASK_STATES = {
  PENDING: "pending",
  COMPLETED: "completed"
};

export const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

const idState = { counter: 0 };

// Returns a unique ID such as "task-1". isTaken is a callback that checks the DOM.
export function generateTaskId(isTaken = () => false) {
  let id;
  do {
    idState.counter += 1;
    id = `task-${idState.counter}`;
  } while (isTaken(id));
  return id;
}

// Calculates the counts from a list of data-state values (never hard-coded).
export function calculateCounts(states) {
  const pending = states.filter((state) => state === TASK_STATES.PENDING).length;
  const completed = states.filter((state) => state === TASK_STATES.COMPLETED).length;
  return { total: states.length, pending, completed };
}
