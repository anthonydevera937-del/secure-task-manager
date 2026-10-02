let taskCounter = 0;

// Required: updateTaskCounts()
function updateTaskCounts() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
    const tasks = taskList.querySelectorAll('.task-item');
    const total = tasks.length;
    let completed = 0;

    tasks.forEach(task => {
        if (task.dataset.state === 'completed') {
            completed++;
        }
    });

    const pending = total - completed;

    const totalCount = document.getElementById('totalCount');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');

    if (totalCount) totalCount.textContent = total;
    if (pendingCount) pendingCount.textContent = pending;
    if (completedCount) completedCount.textContent = completed;
}

// Required: createTaskElement(taskText, taskId)
function createTaskElement(taskText, taskId) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = taskId;
    li.dataset.state = 'pending';

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskText;

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

// Required: addTask(taskText)
function addTask(taskText) {
    const taskInput = document.getElementById('taskInput');
    const taskMessage = document.getElementById('taskMessage');
    const taskList = document.getElementById('taskList');

    const trimmedText = taskText.trim();
    if (!trimmedText) {
        if (taskMessage) taskMessage.textContent = 'Task cannot be empty';
        return;
    }

    if (taskMessage) taskMessage.textContent = '';
    taskCounter++;
    const taskId = `task-${taskCounter}`;

    const taskItem = createTaskElement(trimmedText, taskId);
    if (taskList) taskList.appendChild(taskItem);

    if (taskInput) taskInput.value = '';
    updateTaskCounts();
}

// Required: toggleTaskComplete(taskItem)
function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.dataset.state === 'completed';
    if (isCompleted) {
        taskItem.dataset.state = 'pending';
        taskItem.classList.remove('completed');
    } else {
        taskItem.dataset.state = 'completed';
        taskItem.classList.add('completed');
    }
    updateTaskCounts();
}

// Required: beginTaskEdit(taskItem)
function beginTaskEdit(taskItem) {
    const span = taskItem.querySelector('.task-text');
    const editBtn = taskItem.querySelector('.edit-btn');
    if (!span) return;

    const currentText = span.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = currentText;

    span.replaceWith(input);
    input.focus();
    if (editBtn) editBtn.textContent = 'Save';
}

// Required: saveTaskEdit(taskItem)
function saveTaskEdit(taskItem) {
    const input = taskItem.querySelector('.edit-input');
    const editBtn = taskItem.querySelector('.edit-btn');
    const taskMessage = document.getElementById('taskMessage');
    if (!input) return;

    const trimmedText = input.value.trim();
    if (!trimmedText) {
        if (taskMessage) taskMessage.textContent = 'Task cannot be empty';
        return;
    }

    if (taskMessage) taskMessage.textContent = '';
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = trimmedText;

    input.replaceWith(span);
    if (editBtn) editBtn.textContent = 'Edit';
}

// Required: removeTask(taskItem)
function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

// Required: handleTaskListClick(event) - Event Delegation
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

// Required: loadSampleTasks() using DocumentFragment
function loadSampleTasks() {
    const taskList = document.getElementById('taskList');
    const taskMessage = document.getElementById('taskMessage');
    const samples = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    const fragment = document.createDocumentFragment();

    samples.forEach(sampleText => {
        taskCounter++;
        const taskId = `task-${taskCounter}`;
        const taskItem = createTaskElement(sampleText, taskId);
        fragment.appendChild(taskItem);
    });

    if (taskList) taskList.appendChild(fragment);
    if (taskMessage) taskMessage.textContent = '';
    updateTaskCounts();
}

// Export for Autograder Compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createTaskElement,
        addTask,
        toggleTaskComplete,
        beginTaskEdit,
        saveTaskEdit,
        removeTask,
        updateTaskCounts,
        handleTaskListClick,
        loadSampleTasks
    };
}

// Browser Initialization Guard
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const taskInput = document.getElementById('taskInput');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const loadSamplesBtn = document.getElementById('loadSamplesBtn');
        const taskList = document.getElementById('taskList');

        if (addTaskBtn && taskInput) {
            addTaskBtn.addEventListener('click', () => {
                addTask(taskInput.value);
            });

            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addTask(taskInput.value);
                }
            });
        }

        if (loadSamplesBtn) {
            loadSamplesBtn.addEventListener('click', () => {
                loadSampleTasks();
            });
        }

        if (taskList) {
            taskList.addEventListener('click', handleTaskListClick);
        }

        updateTaskCounts();
    });
}