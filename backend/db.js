const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "tasks.db");

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function getAllTasks(callback) {
  db.all("SELECT * FROM tasks ORDER BY id DESC", [], callback);
}

function createTask(title, callback) {
  db.run(
    "INSERT INTO tasks (title, completed) VALUES (?, 0)",
    [title],
    function (err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID, title, completed: 0 });
    }
  );
}

function updateTask(id, fields, callback) {
  const { title, completed } = fields;
  db.run(
    "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
    [title, completed ? 1 : 0, id],
    function (err) {
      if (err) return callback(err);
      callback(null, { id, title, completed: completed ? 1 : 0 });
    }
  );
}

function deleteTask(id, callback) {
  db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
    if (err) return callback(err);
    callback(null, { success: true });
  });
}

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
