const { v4: uuid } = require("uuid");
const { readJson, writeJson } = require("./dataService");

const TASKS_FILE = "tasks.json";

async function listTasks() {
  const { tasks } = await readJson(TASKS_FILE);
  const now = Date.now();
  let updated = false;

  // Auto-lock overdue tasks (unless temporarily unlocked)
  tasks.forEach((task) => {
    const isTemporarilyUnlocked = task.unlockedUntil && new Date(task.unlockedUntil).getTime() > now;
    if (!task.completed && task.dueAt && new Date(task.dueAt).getTime() < now && !task.locked && !isTemporarilyUnlocked) {
      task.locked = true;
      task.updatedAt = new Date().toISOString();
      updated = true;
    }
  });

  if (updated) {
    await writeJson(TASKS_FILE, { tasks });
  }

  return tasks.sort((a, b) => {
    if (a.priority === "important" && b.priority !== "important") return -1;
    if (a.priority !== "important" && b.priority === "important") return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

async function createTask(input) {
  const payload = await readJson(TASKS_FILE);
  const now = new Date().toISOString();
  const task = {
    id: uuid(),
    title: input.title,
    notes: input.notes || "",
    list: input.list || "My Day",
    completed: false,
    priority: input.priority || "normal",
    color: input.color || "sage",
    dueAt: input.dueAt || null,
    locked: Boolean(input.locked),
    createdAt: now,
    updatedAt: now,
  };

  payload.tasks.unshift(task);
  await writeJson(TASKS_FILE, payload);
  return task;
}

async function updateTask(id, updates) {
  const payload = await readJson(TASKS_FILE);
  const index = payload.tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;

  payload.tasks[index] = {
    ...payload.tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeJson(TASKS_FILE, payload);
  return payload.tasks[index];
}

async function removeTask(id) {
  const payload = await readJson(TASKS_FILE);
  const index = payload.tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;

  const [deleted] = payload.tasks.splice(index, 1);
  await writeJson(TASKS_FILE, payload);
  return deleted;
}

module.exports = { listTasks, createTask, updateTask, removeTask };
