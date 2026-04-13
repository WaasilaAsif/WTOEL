const { getProfile, saveProfile, applyProgress } = require("./profileService");

function pointsForTask(task) {
  let points = task.priority === "important" ? 20 : 10;
  if (task.dueAt) points += 15;
  return points;
}

async function startFocus({ taskId, durationMinutes }) {
  const profile = await getProfile();
  profile.focusSession = {
    taskId,
    durationMinutes,
    startedAt: new Date().toISOString(),
    status: "active",
  };
  await saveProfile(profile);
  return profile;
}

async function failFocus({ reason = "Focus broken" }) {
  const profile = await getProfile();
  profile.focusSession = null;
  profile.streaks.focus = Math.max(0, profile.streaks.focus - 1);
  profile.streaks.combo = 1;
  profile.avatarMood = "sad";
  profile.points = Math.max(0, profile.points - 10);
  profile.recentWins.unshift(`Focus failed: ${reason}`);
  profile.recentWins = profile.recentWins.slice(0, 8);
  await saveProfile(profile);
  return profile;
}

async function completeFocus({ task }) {
  const profile = await getProfile();
  const baseXp = task.priority === "important" ? 80 : 50;
  const streakBonus = profile.streaks.focus * 5;

  profile.focusSession = null;
  profile.xp += baseXp + streakBonus;
  profile.points += pointsForTask(task) + 20;
  profile.streaks.focus += 1;
  profile.streaks.daily += 1;
  profile.streaks.noFail += 1;
  profile.streaks.combo = Math.min(5, profile.streaks.combo + 1);
  profile.avatarMood = "excited";
  profile.badges = Array.from(
    new Set([
      ...profile.badges,
      profile.streaks.focus >= 3 ? "Focus Flame" : "Deep Worker",
    ])
  );
  profile.recentWins.unshift("Focus victory + XP burst");
  profile.recentWins = profile.recentWins.slice(0, 8);

  const leveled = applyProgress(profile);
  await saveProfile(leveled);
  return leveled;
}

module.exports = { startFocus, failFocus, completeFocus, pointsForTask };
