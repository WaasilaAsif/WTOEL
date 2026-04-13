const { readJson, writeJson } = require("./dataService");

const PROFILE_FILE = "profile.json";

const TITLES = [
  "Diva Queen",
  "Chaos Slayer",
  "Productivity Goblin",
  "Focus Witch",
  "Time Wizard",
  "Deadline Destroyer",
  "Supreme Planner",
];

function levelFromXp(xp) {
  return Math.floor(Math.sqrt(xp / 120)) + 1;
}

function nextLevelXp(level) {
  return Math.pow(level, 2) * 120;
}

async function getProfile() {
  return readJson(PROFILE_FILE);
}

async function saveProfile(profile) {
  await writeJson(PROFILE_FILE, profile);
  return profile;
}

function applyProgress(profile) {
  const level = levelFromXp(profile.xp);
  const titleIndex = Math.min(level - 1, TITLES.length - 1);
  const title = TITLES[titleIndex];

  return {
    ...profile,
    level,
    title,
    titlesUnlocked: Array.from(new Set([...profile.titlesUnlocked, title])),
    nextLevelXp: nextLevelXp(level + 1),
  };
}

module.exports = { getProfile, saveProfile, applyProgress, TITLES };
