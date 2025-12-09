// Load tasks when page is ready
window.addEventListener("DOMContentLoaded", load);

// Fetch and display all tasks
async function load() {
  try {
    const res = await fetch("/api/tasks");
    const tasks = await res.json();

    const taskList = document.getElementById("tasks");
    taskList.innerHTML = "";

    tasks.forEach((task) => renderTask(task));
  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

// Add a task when the form is submitted
document.getElementById("task-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("task-title").value.trim();
  if (!title) return;

  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const newTask = await res.json();
    renderTask(newTask);

    document.getElementById("task-title").value = "";
  } catch (err) {
    console.error("Error adding task:", err);
  }
});

// Render a single task row
function renderTask(task) {
  const taskList = document.getElementById("tasks");

  const li = document.createElement("li");
  li.dataset.id = task.id;

  li.innerHTML = `
    <div class="task-main">
      <div class="task-status-dot ${task.completed ? "completed" : ""}"></div>
      <span class="task-title ${task.completed ? "completed" : ""}">
        ${task.title}
      </span>
    </div>
    <div class="task-actions">
      <button class="btn-chip primary" onclick="toggleComplete(${task.id}, ${task.completed})">
        <span>✓</span> Done
      </button>
      <button class="btn-chip danger" onclick="deleteTask(${task.id})">
        <span>✖</span> Delete
      </button>
    </div>
  `;

  taskList.appendChild(li);
}

// Toggle completed state
async function toggleComplete(id, currentState) {
  try {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentState }),
    });

    refreshUI();
  } catch (err) {
    console.error("Error updating task:", err);
  }
}

// Delete a task
async function deleteTask(id) {
  try {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    refreshUI();
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

// Refresh UI after updates
async function refreshUI() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();

  const taskList = document.getElementById("tasks");
  taskList.innerHTML = "";

  tasks.forEach((task) => renderTask(task));
}
