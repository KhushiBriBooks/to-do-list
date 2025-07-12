let input = document.getElementById("inputcol");
let taskList = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const noTasksMessage = document.getElementById("no-task-message");
    console.log(noTasksMessage);

function updateCounters(showMessage = false) {
    const allTasks = document.querySelectorAll("#list-container li");
    const completed = document.querySelectorAll("#list-container li.checked").length;
    const uncompleted = allTasks.length - completed;

    document.getElementById("completed-counter").textContent = completed;
    document.getElementById("uncompleted-counter").textContent = uncompleted;


    if (allTasks.length === 0) {
        noTasksMessage.style.display = "block";
    } else {
        noTasksMessage.style.display = "none";
    }

    if (showMessage) {
        const messageDiv = document.getElementById("completion-message");

        if (allTasks.length > 0 && uncompleted === 0 && completed === allTasks.length) {
            messageDiv.textContent = "🎉 Yay! You are done for the day!";
        } else {
            messageDiv.textContent = `🎉 Yay! You have completed a task, ${uncompleted} more to go.`;
        }

        messageDiv.classList.add("show");

        setTimeout(() => {
            messageDiv.classList.remove("show");
        }, 3000);
    }
}

function addTask() {
    if (input.value.trim() === '') {
        alert("You must write something!");
        return;
    }
    let task = document.createElement("li");

    let textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = input.value.trim();
    task.appendChild(textSpan);

    let iconContainer = document.createElement("div");
    iconContainer.className = "icon-container";

    let editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.className = "edit-icon";
    iconContainer.appendChild(editBtn);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "❌";
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
    } else if (e.target.classList.contains("task-text") || e.target === task) {
        const wasCompleted = task.classList.contains("checked");
        task.classList.toggle("checked");
        saveData();

        if (!wasCompleted && task.classList.contains("checked")) {
            updateCounters(true);
        } else {
            updateCounters();
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
    updateCounters();
}

showTask();
