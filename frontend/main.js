const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const list = document.getElementById("tasks");

async function load() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();
  list.innerHTML = "";
  tasks.forEach(renderTask);
}

function renderTask(task) {
  const li = document.createElement("li");

  const text = document.createElement("span");
  text.textContent = task.title;
  if (task.completed) text.classList.add("completed");

  const toggle = document.createElement("button");
  toggle.textContent = task.completed ? "Undo" : "Done";
  toggle.onclick = async () => {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task.title, completed: !task.completed })
    });
    load();
  };

  const del = document.createElement("button");
  del.textContent = "Delete";
  del.onclick = async () => {
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    load();
  };

  li.append(text, toggle, del);
  list.appendChild(li);
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  titleInput.value = "";
  load();
};

load();
