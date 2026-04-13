const { readJson, writeJson } = require("./dataService");
const { getProfile, saveProfile } = require("./profileService");

const REWARDS_FILE = "rewards.json";

async function getRewards() {
  return readJson(REWARDS_FILE);
}

async function spendReward(rewardId) {
  const rewards = await readJson(REWARDS_FILE);
  const profile = await getProfile();
  const item = rewards.shop.find((reward) => reward.id === rewardId);

  if (!item) {
    throw new Error("Reward not found");
  }

  if (profile.points < item.cost) {
    throw new Error("Not enough points");
  }

  profile.points -= item.cost;
  rewards.inventory.unshift({ ...item, purchasedAt: new Date().toISOString() });

  await writeJson(REWARDS_FILE, rewards);
  await saveProfile(profile);

  return { profile, rewards };
}

module.exports = { getRewards, spendReward };
