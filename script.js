const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const prioritySelect = document.getElementById("priority");
const clearBtn = document.getElementById("clearBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

loadTasks();

addBtn.addEventListener("click", function () {

    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        text: taskText,
        priority: priority
    };

    addTask(task);

    saveTask(task);

    taskInput.value = "";

});

clearBtn.addEventListener("click", function () {

    localStorage.removeItem("tasks");

    taskList.innerHTML = "";

});

function addTask(task) {

    const li = document.createElement("li");

    const taskSpan = document.createElement("span");

    taskSpan.innerHTML =
        `${task.text} <span class="priority">(${task.priority})</span>`;

    taskSpan.addEventListener("click", function () {

        if (taskSpan.style.textDecoration === "line-through") {
            taskSpan.style.textDecoration = "none";
        } else {
            taskSpan.style.textDecoration = "line-through";
        }

    });

    const deleteBtn = document.createElement("button");

    deleteBtn.innerText = "Delete";

    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", function () {

        li.remove();

        removeTask(task.text);

    });

    li.appendChild(taskSpan);

    li.appendChild(deleteBtn);

    taskList.appendChild(li);

}

function saveTask(task) {

    let tasks = [];

    if (localStorage.getItem("tasks")) {

        tasks = JSON.parse(localStorage.getItem("tasks"));

    }

    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function loadTasks() {

    let tasks = [];

    if (localStorage.getItem("tasks")) {

        tasks = JSON.parse(localStorage.getItem("tasks"));

    }

    tasks.forEach(function (task) {

        addTask(task);

    });

}

function removeTask(taskToRemove) {

    let tasks = JSON.parse(localStorage.getItem("tasks"));

    tasks = tasks.filter(function (task) {

        return task.text !== taskToRemove;

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

}
darkModeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

});