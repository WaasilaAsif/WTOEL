const taskService = require("../services/taskService");
const focusService = require("../services/focusService");

async function startFocus(req, res) {
  const { taskId, durationMinutes } = req.body;
  if (!taskId || !durationMinutes) {
    return res.status(400).json({ message: "taskId and durationMinutes are required" });
  }

  const profile = await focusService.startFocus({ taskId, durationMinutes });
  return res.json(profile);
}

async function failFocus(req, res) {
  const profile = await focusService.failFocus(req.body || {});
  return res.json(profile);
}

async function completeFocus(req, res) {
  const tasks = await taskService.listTasks();
  const task = tasks.find((item) => item.id === req.body.taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  await taskService.updateTask(task.id, { completed: true });
  const profile = await focusService.completeFocus({ task });
  return res.json(profile);
}

module.exports = { startFocus, failFocus, completeFocus };
