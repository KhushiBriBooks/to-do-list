let input = document.getElementById("inputcol");
let taskList = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const noTasksMessage = document.getElementById("no-task-message");
const actionButtons = document.getElementById("action-btns");

function updateCounters(showMessage = false) {
    const allTasks = document.querySelectorAll("#list-container li");
    const completed = document.querySelectorAll("#list-container li.checked").length;
    const uncompleted = allTasks.length - completed;

    completedCounter.textContent = completed;
    uncompletedCounter.textContent = uncompleted;

    noTasksMessage.style.display = allTasks.length === 0 ? "block" : "none";

    if (showMessage) {
        const messageDiv = document.getElementById("completion-message");
        if (allTasks.length > 0 && uncompleted === 0) {
            messageDiv.textContent = "\u{1F389} Yay! You are done for the day!";
        } else {
            messageDiv.textContent = `\u{1F389} Yay! You have completed a task, ${uncompleted} more to go.`;
        }
        messageDiv.classList.add("show");
        setTimeout(() => {
            messageDiv.classList.remove("show");
        }, 3000);
    }
}

actionButtons.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") return;

    const allTasks = document.querySelectorAll("#list-container li");
    const selectedTasks = Array.from(allTasks).filter(task =>
        task.querySelector(".task-select")?.checked
    );

    if (e.target.id === "completed-btn") {
        selectedTasks.forEach(task => {
            task.classList.add("checked");
        });
        updateCounters(true);
        saveData();
    }
});

function addTask() {
    if (input.value.trim() === '') {
        alert("You must write something!");
        return;
    }
    let task = document.createElement("li");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-select";

    let textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = input.value.trim();

    task.appendChild(checkbox);
    task.appendChild(textSpan);

    let iconContainer = document.createElement("div");
    iconContainer.className = "icon-container";

    let editBtn = document.createElement("button");
    editBtn.innerHTML = "&#128393;";
    editBtn.className = "edit-icon";
    iconContainer.appendChild(editBtn);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "&#128465;";
    deleteBtn.className = "delete-icon";
    iconContainer.appendChild(deleteBtn);

    task.appendChild(iconContainer);

    taskList.appendChild(task);

    input.value = "";
    saveData();
    updateCounters();
}

taskList.addEventListener("click", function (e) {
    const task = e.target.closest("li");
    if (!task) return;

    if (e.target.classList.contains("delete-icon")) {
        task.remove();
        saveData();
        updateCounters();
    } else if (e.target.classList.contains("edit-icon")) {
        editTask(task);
    } else if (e.target.classList.contains("task-select")) {
        if (!e.target.checked) {
            task.classList.remove("checked");
            updateCounters();
            saveData();
        }
    }
});

function editTask(task) {
    const textSpan = task.querySelector(".task-text");
    const currentText = textSpan.textContent.trim();

    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.value = currentText;
    inputEdit.classList.add("edit-input");

    task.replaceChild(inputEdit, textSpan);
    inputEdit.focus();

    let editSaved = false;

    function handleSaveEdit() {
        if (editSaved) return;
        editSaved = true;
        saveEdit(task, inputEdit);
    }

    inputEdit.addEventListener("blur", handleSaveEdit);
    inputEdit.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSaveEdit();
            inputEdit.blur();
        }
    });
}

function saveEdit(task, inputEdit) {
    const newValue = inputEdit.value.trim();
    if (newValue === "") {
        alert("Task cannot be empty!");
        inputEdit.focus();
    } else {
        const textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.textContent = newValue;
        task.replaceChild(textSpan, inputEdit);
        saveData();
    }
}

function saveData() {
    localStorage.setItem("data", taskList.innerHTML);
    updateCounters();
}

function showTask() {
    taskList.innerHTML = localStorage.getItem("data") || "";
    const allTasks = document.querySelectorAll("#list-container li");
    allTasks.forEach(task => {
        const checkbox = task.querySelector(".task-select");
        checkbox.checked = task.classList.contains("checked");
    });

    updateCounters();
}

showTask();