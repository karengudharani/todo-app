const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const searchInput = document.getElementById("searchInput");
const dueDateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const prioritySelect = document.getElementById("priority");
const categorySelect = document.getElementById("category");
const sortTasks = document.getElementById("sortTasks");
const clearBtn = document.getElementById("clearBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");
const toast = document.getElementById("toast");

let currentFilter = "all";
let searchText = "";
let tasks = loadTasks();

renderTasks();

addBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const category = categorySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now().toString(),
        text: taskText,
        priority: priority,
        category: category,
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
showToast("All tasks cleared");
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

if (searchInput) {
    searchInput.addEventListener("input", function () {
        searchText = searchInput.value.toLowerCase();
        renderTasks();
    });
}

if (sortTasks) {
    sortTasks.addEventListener("change", function () {
        renderTasks();
    });
}

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
    updateTaskCount();
    updateProgress();

    let filteredTasks = tasks.filter(function (task) {
        const matchesFilter =
            currentFilter === "pending"
                ? !task.completed
                : currentFilter === "completed"
                ? task.completed
                : true;

        const matchesSearch = task.text.toLowerCase().includes(searchText);

        return matchesFilter && matchesSearch;
    });

    if (sortTasks) {
        const sortValue = sortTasks.value;

        if (sortValue === "name") {
            filteredTasks.sort(function (a, b) {
                return a.text.localeCompare(b.text);
            });
        }

        if (sortValue === "date") {
            filteredTasks.sort(function (a, b) {
                const dateA = a.dueDate || "9999-12-31";
                const dateB = b.dueDate || "9999-12-31";
                return dateA.localeCompare(dateB);
            });
        }

        if (sortValue === "priority") {
            const order = {
                High: 1,
                Medium: 2,
                Low: 3
            };

            filteredTasks.sort(function (a, b) {
                return order[a.priority] - order[b.priority];
            });
        }
    }

    filteredTasks.forEach(function (task) {
        const li = document.createElement("li");

        if (task.priority === "High") {
            li.classList.add("high-priority");
        }

        if (task.priority === "Medium") {
            li.classList.add("medium-priority");
        }

        if (task.priority === "Low") {
            li.classList.add("low-priority");
        }

        const taskSpan = document.createElement("span");

        taskSpan.innerHTML = `
            ${task.text}
            <span class="priority">(${task.priority})</span>
            <span class="category">[${task.category || "Study"}]</span>
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
showToast("Task added successfully");
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

            const newDueDate = prompt(
                "Edit due date (YYYY-MM-DD):",
                task.dueDate || ""
            );

            task.text = trimmedText;
            task.dueDate = newDueDate ? newDueDate.trim() : "";

            saveTasks();
renderTasks();
showToast("Task updated");
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
showToast("Task deleted");
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(taskSpan);
        li.appendChild(actions);

        taskList.appendChild(li);
    });
}

function updateTaskCount() {
    totalCount.textContent = tasks.length;

    pendingCount.textContent = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    completedCount.textContent = tasks.filter(function (task) {
        return task.completed;
    }).length;
}

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (progressBar) {
        progressBar.style.width = percent + "%";
    }

    if (progressText) {
        progressText.textContent = percent + "% Completed";
    }
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
                category: "Study",
                dueDate: "",
                completed: false
            };
        }

        return {
            id: task.id || Date.now().toString() + Math.random(),
            text: task.text || "",
            priority: task.priority || "Medium",
            category: task.category || "Study",
            dueDate: task.dueDate || "",
            completed: !!task.completed
        };
    });
}
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 2000);
}