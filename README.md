# Secure Dynamic Task Manager

## Student Information
- **Name:** Louis Anthony L. De Vera
- **Year & Section:** 3rd Year, Block 8
- **Date:** October 2, 2026

## Project Overview
The **Secure Dynamic Task Manager** is a laboratory activity developed for Event-Driven Programming (ITP10) at Universidad de Dagupan - School of Information Technology Education (SITE). The application allows users to programmatically create, modify, complete, and remove tasks dynamically using vanilla JavaScript, modern DOM manipulation APIs, and event delegation, while ensuring secure handling against XSS vulnerabilities.

---

## Project Structure
Implementation Details & Explanations
Initial Application State

Explanation: Upon opening index.html, the task list (#taskList) starts completely empty with zero hard-coded elements, and all summary counts default to 0 (Total, Pending, Completed).

Task Creation & Safety (XSS Prevention)

Explanation: Tasks are dynamically created using document.createElement() and user inputs are assigned exclusively via textContent. This prevents HTML and script injections (such as <img src=x onerror=alert(1)>), rendering malicious strings literally as safe text.

Validation Mechanism

Explanation: Both addTask() and saveTaskEdit() validate user inputs to ensure they are not blank or whitespace-only. If invalid, the exact warning message "Task cannot be empty" is displayed inside #taskMessage.

Event Delegation & Traversal

Explanation: Instead of attaching individual event listeners to every generated button, a single click event listener is delegated to #taskList. It uses event.target.matches() to identify clicked action buttons and event.target.closest('.task-item') to locate the specific task owner.

State Management & Summary Updates

Explanation: Task completion toggles the .completed class and switches the data-state attribute between "pending" and "completed". The function updateTaskCounts() dynamically calculates totals directly from live DOM nodes without hard-coding.

Batch Insertion via DocumentFragment

Explanation: The loadSampleTasks() function uses document.createDocumentFragment() to bundle the required sample tasks (Review DOM selectors, Practice createElement, Study event delegation) and appends them to the DOM in a single efficient operation.