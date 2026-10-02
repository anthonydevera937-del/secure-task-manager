// Kunin ang mga elemento mula sa HTML gamit ang kanilang ID
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const loadSamplesBtn = document.getElementById('loadSamplesBtn');
const taskList = document.getElementById('taskList');
const taskMessage = document.getElementById('taskMessage');
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

let taskIdCounter = 1;

// Function para gumawa ng task element gamit ang createElement at textContent para ligtas sa XSS
function createTaskElement(taskText, taskId) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = taskId;
    li.dataset.state = 'pending';

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskText; // Pinipigilan ang XSS attacks

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = 'Complete';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';

    // Pagdugtong-dugtungin ang mga elemento sa loob ng li
    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);

    return li;
}

// Function para magdagdag ng bagong task na may validation sa blank input
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

// Function para i-toggle ang estado ng task kung tapos na o hindi pa
function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.classList.toggle('completed');
    taskItem.dataset.state = isCompleted ? 'completed' : 'pending';
    
    const completeBtn = taskItem.querySelector('.complete-btn');
    if (completeBtn) {
        completeBtn.textContent = isCompleted ? 'Undo' : 'Complete';
    }
    
    updateTaskCounts();
}

// Function para simulan ang pag-edit ng task
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

// Function para i-save ang binagong task na may validation
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

// Function para mag-delete ng task
function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

// Function para i-update ang mga counter sa summary section
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

// Event Delegation para sa mga pindutan sa task list
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

// Function para mag-load ng sample tasks gamit ang DocumentFragment para sa performance
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

// Pagkabit ng mga Event Listeners sa mga main buttons at inputs
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

// Isang delegated listener para sa buong taskList
taskList.addEventListener('click', handleTaskListClick);

// Paunang tawag sa count updater pag-load ng pahina
updateTaskCounts();