document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const loadSamplesBtn = document.getElementById('loadSamplesBtn');
    const taskList = document.getElementById('taskList');
    const taskMessage = document.getElementById('taskMessage');
    
    const totalCount = document.getElementById('totalCount');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');

    let taskCounter = 0;

    // Helper: Update Task Counts from Current DOM state
    function updateTaskCounts() {
        const tasks = taskList.querySelectorAll('.task-item');
        const total = tasks.length;
        let completed = 0;

        tasks.forEach(task => {
            if (task.dataset.state === 'completed') {
                completed++;
            }
        });

        const pending = total - completed;

        totalCount.textContent = total;
        pendingCount.textContent = pending;
        completedCount.textContent = completed;
    }

    // Required: createTaskElement(taskText, taskId)
    function createTaskElement(taskText, taskId) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.taskId = taskId;
        li.dataset.state = 'pending';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = taskText; // Safe XSS protection

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
        const trimmedText = taskText.trim();
        if (!trimmedText) {
            taskMessage.textContent = 'Task cannot be empty';
            return;
        }

        taskMessage.textContent = '';
        taskCounter++;
        const taskId = `task-${taskCounter}`;

        const taskItem = createTaskElement(trimmedText, taskId);
        taskList.appendChild(taskItem);

        taskInput.value = '';
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
        editBtn.textContent = 'Save';
    }

    // Required: saveTaskEdit(taskItem)
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
        span.textContent = trimmedText; // Safe XSS protection

        input.replaceWith(span);
        editBtn.textContent = 'Edit';
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

        taskList.appendChild(fragment);
        taskMessage.textContent = '';
        updateTaskCounts();
    }

    // Event Listeners
    addTaskBtn.addEventListener('click', () => {
        addTask(taskInput.value);
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(taskInput.value);
        }
    });

    loadSamplesBtn.addEventListener('click', () => {
        loadSampleTasks();
    });

    // Exactly one delegated click listener on #taskList
    taskList.addEventListener('click', handleTaskListClick);

    // Initial State Check
    updateTaskCounts();
});