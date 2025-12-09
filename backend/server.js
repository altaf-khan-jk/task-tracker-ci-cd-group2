const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// GET Tasks
app.get("/api/tasks", (req, res) => {
  getAllTasks((err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(rows);
  });
});

// POST Task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "") return res.status(400).json({ error: "Title required" });

  createTask(title, (err, task) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.status(201).json(task);
  });
});

// PUT Task
app.put("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  const { title, completed } = req.body;

  if (!title || title.trim() === "") return res.status(400).json({ error: "Title required" });

  updateTask(id, { title, completed }, (err, task) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(task);
  });
});

// DELETE Task
app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  deleteTask(id, (err, result) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(result);
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = app;
