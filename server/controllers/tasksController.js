const taskService = require("../services/taskService");
const { getProfile, saveProfile } = require("../services/profileService");
const { pointsForTask } = require("../services/focusService");

async function getTasks(_req, res) {
  const tasks = await taskService.listTasks();
  res.json(tasks);
}

async function postTask(req, res) {
  if (!req.body.title?.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await taskService.createTask(req.body);
  return res.status(201).json(task);
}

async function putTask(req, res) {
  const task = await taskService.updateTask(req.params.id, req.body);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (req.body.completed === true) {
    const profile = await getProfile();
    profile.points += pointsForTask(task);
    profile.xp += task.priority === "important" ? 35 : 20;
    profile.stats.tasksCompleted += 1;
    profile.stats.completionRate = Math.min(
      100,
      Math.round((profile.stats.tasksCompleted / Math.max(1, profile.stats.tasksCompleted + 3)) * 100)
    );
    profile.stats.taskVelocity = Math.min(12, profile.stats.taskVelocity + 1);
    profile.recentWins.unshift(`Completed: ${task.title}`);
    profile.recentWins = profile.recentWins.slice(0, 8);
    await saveProfile(profile);
  }

  return res.json(task);
}

async function deleteTask(req, res) {
  const task = await taskService.removeTask(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.json(task);
}

module.exports = { getTasks, postTask, putTask, deleteTask };
