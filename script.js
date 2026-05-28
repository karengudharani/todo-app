const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const prioritySelect = document.getElementById("priority");
const clearBtn = document.getElementById("clearBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

let tasks = loadTasks();

renderTasks();

addBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now().toString(),
        text: taskText,
        priority: priority,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = "";
});

clearBtn.addEventListener("click", function () {
    tasks = [];
    saveTasks();
    renderTasks();
});

if (darkModeBtn) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    darkModeBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const li = document.createElement("li");

        const taskSpan = document.createElement("span");
        taskSpan.innerHTML = `${task.text} <span class="priority">(${task.priority})</span>`;

        if (task.completed) {
            taskSpan.classList.add("completed");
        }

        taskSpan.addEventListener("click", function () {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const actions = document.createElement("div");
        actions.classList.add("task-actions");

        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("edit-btn");

        editBtn.addEventListener("click", function () {
            const newText = prompt("Edit your task:", task.text);

            if (newText === null) return;

            const trimmedText = newText.trim();

            if (trimmedText === "") {
                alert("Task cannot be empty");
                return;
            }

            task.text = trimmedText;
            saveTasks();
            renderTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", function () {
            tasks = tasks.filter(function (t) {
                return t.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(taskSpan);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");

    if (!storedTasks) return [];

    const parsed = JSON.parse(storedTasks);

    return parsed.map(function (task) {
        if (typeof task === "string") {
            return {
                id: Date.now().toString() + Math.random(),
                text: task,
                priority: "Medium",
                completed: false
            };
        }

        return {
            id: task.id || Date.now().toString() + Math.random(),
            text: task.text || "",
            priority: task.priority || "Medium",
            completed: !!task.completed
        };
    });
}