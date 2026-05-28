const addBtn = document.getElementById("addBtn");

const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");


loadTasks();


addBtn.addEventListener("click", function () {

    const taskText = taskInput.value;

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    addTask(taskText);

    saveTask(taskText);

    taskInput.value = "";

});


function addTask(taskText) {

    const li = document.createElement("li");

    li.innerText = taskText;


    li.addEventListener("click", function () {

        li.style.textDecoration = "line-through";

    });


    const deleteBtn = document.createElement("button");

    deleteBtn.innerText = "Delete";

    deleteBtn.style.backgroundColor = "red";

    deleteBtn.style.color = "white";


    deleteBtn.addEventListener("click", function () {

        li.remove();

        removeTask(taskText);

    });


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

        return task !== taskToRemove;

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

}