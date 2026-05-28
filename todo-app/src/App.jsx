import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [darkMode, setDarkMode] = useState(false);

  const [task, setTask] = useState("");

  const [editIndex, setEditIndex] = useState(null);

  const [editText, setEditText] = useState("");

  const [tasks, setTasks] = useState(() => {

    const savedTasks = localStorage.getItem("tasks");

    return savedTasks ? JSON.parse(savedTasks) : [];

  });


  useEffect(() => {

    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );

  }, [tasks]);


  function addTask() {

    if (task.trim() === "") {
      return;
    }

    const newTask = {
      text: task,
      completed: false
    };

    setTasks([...tasks, newTask]);

    setTask("");
  }


  function deleteTask(indexToDelete) {

    const updatedTasks = tasks.filter(
      (_, index) => index !== indexToDelete
    );

    setTasks(updatedTasks);
  }


  function startEdit(index, currentText) {

    setEditIndex(index);

    setEditText(currentText);

  }


  function saveEdit(index) {

    const updatedTasks = [...tasks];

    updatedTasks[index].text = editText;

    setTasks(updatedTasks);

    setEditIndex(null);

    setEditText("");

  }


  function toggleComplete(indexToToggle) {

    const updatedTasks = [...tasks];

    updatedTasks[indexToToggle].completed =
      !updatedTasks[indexToToggle].completed;

    setTasks(updatedTasks);
  }


  return (

    <div className={darkMode ? "app dark" : "app"}>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="dark-btn"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>


      <h1 className="title">
        📝 My To-Do App
      </h1>

      <div className="input-container">

        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="input-box"
        />

        <button
          onClick={addTask}
          className="add-btn"
        >
          Add
        </button>

      </div>


      <ul className="task-list">

        {tasks.map((item, index) => (

          <li
            key={index}
            className="task-item"
          >

            {editIndex === index ? (

              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />

            ) : (

              <span
                onClick={() => toggleComplete(index)}
                style={{
                  textDecoration: item.completed
                    ? "line-through"
                    : "none",

                  cursor: "pointer"
                }}
              >
                {item.text}
              </span>

            )}


            {editIndex === index ? (

              <button
                onClick={() => saveEdit(index)}
                className="add-btn"
              >
                Save
              </button>

            ) : (

              <button
                onClick={() => startEdit(index, item.text)}
                className="add-btn"
              >
                Edit
              </button>

            )}


            <button
              onClick={() => deleteTask(index)}
              className="delete-btn"
            >
              Delete
            </button>

          </li>

        ))}

      </ul>

    </div>

  );
}

export default App;