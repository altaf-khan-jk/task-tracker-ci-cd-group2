const request = require("supertest");
const fs = require("fs");
const path = require("path");
let app;

beforeAll(() => {
  const dbFile = path.join(__dirname, "..", "data", "tasks.db");
  if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);

  app = require("../backend/server");
});

describe("Task API", () => {
  test("GET /api/tasks returns [] initially", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

  test("POST /api/tasks creates task", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "Test" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test");
  });

  test("POST /api/tasks rejects empty title", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "" });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/tasks/:id updates task", async () => {
    const c = await request(app).post("/api/tasks").send({ title: "Old" });
    const id = c.body.id;

    const u = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ title: "New", completed: true });

    expect(u.body.title).toBe("New");
    expect(u.body.completed).toBe(1);
  });

  test("DELETE /api/tasks/:id removes task", async () => {
    const c = await request(app).post("/api/tasks").send({ title: "ToDelete" });
    const id = c.body.id;

    await request(app).delete(`/api/tasks/${id}`);

    const list = await request(app).get("/api/tasks");
    const ids = list.body.map((t) => t.id);

    expect(ids).not.toContain(id);
  });
});
