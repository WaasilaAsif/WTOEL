const { readJson, writeJson } = require("./dataService");
const { getProfile, saveProfile } = require("./profileService");

const REWARDS_FILE = "rewards.json";

async function getRewards() {
  return readJson(REWARDS_FILE);
}

async function spendReward(rewardId, taskId = null) {
  const rewards = await readJson(REWARDS_FILE);
  const profile = await getProfile();
  const item = rewards.shop.find((reward) => reward.id === rewardId);
  const taskService = require("./taskService");

  if (!item) {
    throw new Error("Reward not found");
  }

  if (profile.points < item.cost) {
    throw new Error("Not enough points");
  }

  profile.points -= item.cost;

  // Handle immediate reward effects
  if (rewardId === "revive-streak") {
    // Restore focus streak by 1 (undo the last penalty)
    profile.streaks.focus = Math.min(profile.streaks.focus + 1, 10);
    profile.avatarMood = "excited";
  } else if (rewardId === "reduce-focus" && profile.focusSession) {
    // Reduce active focus session by 5 minutes
    profile.focusSession.durationMinutes = Math.max(5, profile.focusSession.durationMinutes - 5);
  } else if (rewardId === "unlock-task") {
    // Unlock a specific locked task for 1 hour
    if (taskId) {
      const unlockedUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
      await taskService.updateTask(taskId, { locked: false, unlockedUntil });
    }
  } else if (rewardId === "skip-punishment") {
    // Restore 10 points
    profile.points = Math.min(profile.points + 10, 9999);
  } else if (rewardId === "extension") {
    // Add 50 points as a bonus
    profile.points += 50;
  }

  // Store reward in inventory for one-time use items
  rewards.inventory.unshift({ ...item, purchasedAt: new Date().toISOString() });

  await writeJson(REWARDS_FILE, rewards);
  await saveProfile(profile);

  return { profile, rewards };
}

module.exports = { getRewards, spendReward };
