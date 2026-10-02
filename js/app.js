// DOM Element Selectors
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const loadSamplesBtn = document.getElementById('loadSamplesBtn');
const taskList = document.getElementById('taskList');
const taskMessage = document.getElementById('taskMessage');
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

let taskIdCounter = 1;

// Helper: Create a single task element securely using createElement and textContent
function createTaskElement(taskText, taskId) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = taskId;
    li.dataset.state = 'pending';

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskText; // Prevents XSS

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = 'Complete';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);

    return li;
}

// Add a new task from input with whitespace validation
function addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) {
        taskMessage.textContent = 'Task cannot be empty';
        return;
    }

    taskMessage.textContent = '';
    const taskId = `task-${taskIdCounter++}`;
    const taskItem = createTaskElement(trimmedText, taskId);

    taskList.appendChild(taskItem);
    taskInput.value = '';
    updateTaskCounts();
}

// Toggle task completed state
function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.classList.toggle('completed');
    taskItem.dataset.state = isCompleted ? 'completed' : 'pending';
    
    const completeBtn = taskItem.querySelector('.complete-btn');
    if (completeBtn) {
        completeBtn.textContent = isCompleted ? 'Undo' : 'Complete';
    }
    
    updateTaskCounts();
}

// Begin editing task text
function beginTaskEdit(taskItem) {
    const span = taskItem.querySelector('.task-text');
    const editBtn = taskItem.querySelector('.edit-btn');
    if (!span) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = span.textContent;

    span.replaceWith(input);
    input.focus();
    editBtn.textContent = 'Save';
}

// Save edited task text with validation
function saveTaskEdit(taskItem) {
    const input = taskItem.querySelector('.edit-input');
    const editBtn = taskItem.querySelector('.edit-btn');
    if (!input) return;

    const trimmedText = input.value.trim();
    if (!trimmedText) {
        taskMessage.textContent = 'Task cannot be empty';
        return;
    }

    taskMessage.textContent = '';
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = trimmedText;

    input.replaceWith(span);
    editBtn.textContent = 'Edit';
}

// Remove task from DOM
function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

// Update counts dynamically based on DOM states
function updateTaskCounts() {
    const tasks = taskList.querySelectorAll('.task-item');
    let total = tasks.length;
    let completed = 0;

    tasks.forEach(task => {
        if (task.dataset.state === 'completed') {
            completed++;
        }
    });

    let pending = total - completed;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

// Event Delegation for Task List Actions
function handleTaskListClick(event) {
    const target = event.target;
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;

    if (target.matches('.complete-btn')) {
        toggleTaskComplete(taskItem);
    } else if (target.matches('.edit-btn')) {
        if (target.textContent === 'Edit') {
            beginTaskEdit(taskItem);
        } else if (target.textContent === 'Save') {
            saveTaskEdit(taskItem);
        }
    } else if (target.matches('.remove-btn')) {
        removeTask(taskItem);
    }
}

// Load Sample Tasks using DocumentFragment for performance optimization
function loadSampleTasks() {
    const sampleTexts = [
        'Review DOM selectors',
        'Practice createElement',
        'Study event delegation'
    ];

    const fragment = document.createDocumentFragment();

    sampleTexts.forEach(text => {
        const taskId = `task-${taskIdCounter++}`;
        const taskItem = createTaskElement(text, taskId);
        fragment.appendChild(taskItem);
    });

    taskList.appendChild(fragment);
    updateTaskCounts();
}

// Event Listeners Setup
addTaskBtn.addEventListener('click', () => {
    addTask(taskInput.value);
});

taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask(taskInput.value);
    }
});

loadSamplesBtn.addEventListener('click', () => {
    loadSampleTasks();
});

// Single delegated click listener on #taskList
taskList.addEventListener('click', handleTaskListClick);

// Initialize counts on load
updateTaskCounts();