const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const prioritySelect = document.getElementById("priority");
const clearBtn = document.getElementById("clearBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");

let currentFilter = "all";

let tasks = loadTasks();

renderTasks();

addBtn.addEventListener("click", function () {

    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now().toString(),
        text: taskText,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value = "";
    dueDateInput.value = "";

});

clearBtn.addEventListener("click", function () {

    tasks = [];

    saveTasks();

    renderTasks();

});

allBtn.addEventListener("click", function () {

    currentFilter = "all";

    renderTasks();

});

pendingBtn.addEventListener("click", function () {

    currentFilter = "pending";

    renderTasks();

});

completedBtn.addEventListener("click", function () {

    currentFilter = "completed";

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

    tasks
        .filter(function (task) {

            if (currentFilter === "pending") {
                return !task.completed;
            }

            if (currentFilter === "completed") {
                return task.completed;
            }

            return true;

        })
        .forEach(function (task) {

            const li = document.createElement("li");

            const taskSpan = document.createElement("span");

            taskSpan.innerHTML = `
                ${task.text}
                <span class="priority">(${task.priority})</span>
                <span class="due-date">
                    ${task.dueDate ? `Due: ${task.dueDate}` : ""}
                </span>
            `;

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

                const newText = prompt(
                    "Edit your task:",
                    task.text
                );

                if (newText === null) return;

                const trimmedText = newText.trim();

                if (trimmedText === "") {
                    alert("Task cannot be empty");
                    return;
                }

                const newDueDate = prompt(
                    "Edit due date (YYYY-MM-DD):",
                    task.dueDate || ""
                );

                task.text = trimmedText;

                task.dueDate = newDueDate
                    ? newDueDate.trim()
                    : "";

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

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

function loadTasks() {

    const storedTasks =
        localStorage.getItem("tasks");

    if (!storedTasks) return [];

    const parsed = JSON.parse(storedTasks);

    return parsed.map(function (task) {

        if (typeof task === "string") {

            return {
                id:
                    Date.now().toString() +
                    Math.random(),
                text: task,
                priority: "Medium",
                dueDate: "",
                completed: false
            };

        }

        return {
            id:
                task.id ||
                Date.now().toString() +
                    Math.random(),
            text: task.text || "",
            priority:
                task.priority || "Medium",
            dueDate:
                task.dueDate || "",
            completed:
                !!task.completed
        };

    });

}