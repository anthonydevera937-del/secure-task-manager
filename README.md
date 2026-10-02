# Secure Dynamic Task Manager

## Student Information
- **Name:** Louis Anthony L. De Vera
- **Year, Course & Block:** 3rd Year, BSIT, Block 8
- **Subject:** ITP10 | Event-Driven Programming
- **Date:** October 2, 2026

# Secure Dynamic Task Manager

## Project Description
A task manager built with HTML, CSS, and JavaScript. Users can add,
complete, edit, and remove tasks without reloading the page.

Tasks are created with `document.createElement()` and user-entered text
is assigned through `textContent` to prevent HTML or script-like input
from being interpreted as markup. Task buttons use one delegated click
listener on `#taskList`.

## Project Structure
- `index.html` — page structure and required controls
- `css/style.css` — application styling
- `js/app.js` — task creation, editing, removal, event delegation, and counts

## How to Run
Open `index.html` in a web browser.

## How to Test
1. Confirm the task list is empty and all counts are 0.
2. Add a task and verify the counts update.
3. Try adding blank text; confirm `Task cannot be empty` appears.
4. Add `<img src=x onerror=alert(1)>`; confirm it displays as text.
5. Test Complete, Edit/Save, and Remove.
6. Click **Load Sample Tasks** and confirm the three required sample tasks appear.

## Security Notes
The project does not use `innerHTML` for task content or inline event
handlers. Dynamic task actions are handled through event delegation.