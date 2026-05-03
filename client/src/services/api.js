const API_BASE = "http://localhost:4000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export const api = {
  getTasks: () => request("/tasks"),
  createTask: (task) => request("/tasks", { method: "POST", body: JSON.stringify(task) }),
  updateTask: (id, updates) => request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(updates) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
  getProfile: () => request("/profile"),
  updateProfile: (data) => request("/profile", { method: "PUT", body: JSON.stringify(data) }),
  startFocus: (data) => request("/focus/start", { method: "POST", body: JSON.stringify(data) }),
  failFocus: (data) => request("/focus/fail", { method: "POST", body: JSON.stringify(data) }),
  completeFocus: (data) => request("/focus/complete", { method: "POST", body: JSON.stringify(data) }),
  getRewards: () => request("/rewards"),
  spendReward: (rewardId, taskId) => request("/rewards/spend", { method: "POST", body: JSON.stringify({ rewardId, taskId }) }),
};
