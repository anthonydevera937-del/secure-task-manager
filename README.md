# Secure Dynamic Task Manager

**Subject:** ITP10 - Event-Driven Programming (Midterm Laboratory Activity 2)
**School:** Universidad de Dagupan, School of Information Technology Education
**Student:** Louis Anthony L. De Vera - 3rd Year IT, Block 8

A task manager built with HTML, CSS, and JavaScript. Every task is created through the DOM (no page reloads), and user text is always handled safely.

## Features

- Add, complete, edit, and remove tasks without reloading the page
- Summary counts (Total, Pending, Completed) calculated from the current DOM
- Load Sample Tasks button (Review DOM selectors, Practice createElement, Study event delegation)
- "Task cannot be empty" message for blank tasks (on Add and on Save)
- HTML-like text such as `<img src=x onerror=alert(1)>` is shown as plain text and never runs

## Project structure

```
secure-task-manager/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── app.js       (main module: selects the elements, 9 required functions, event listeners)
    ├── data.js      (sample tasks, unique task IDs, count calculation)
    ├── utils.js     (text helpers)
    └── display.js   (shows/clears messages, clears input, shows counts)
```

## How to run

The project uses JavaScript modules (`import` / `export`), so it must be opened through a web server. Double-clicking `index.html` will not work.

- **VS Code:** install the *Live Server* extension, right-click `index.html`, then choose **Open with Live Server**.
- **Python:** run `python -m http.server` inside this folder, then open `http://localhost:8000`.
- **GitHub Pages:** enable Pages for the repository and open the published link.

## Key concepts used

- `document.createElement()`, `textContent`, `classList`, and `dataset` to build and update tasks safely
- One delegated click listener on `#taskList`, using `event.target.matches()` and `event.target.closest(".task-item")`
- `DocumentFragment` to add the sample tasks to the page in one operation
- `taskItem.remove()` to delete a single task
- No `innerHTML`, `insertAdjacentHTML()`, `document.write()`, or inline `onclick`

## Testing

All items in the activity's Testing Requirements were tested in a browser and passed, with no console errors.
