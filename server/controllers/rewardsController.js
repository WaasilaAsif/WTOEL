const { getRewards, spendReward } = require("../services/rewardService");

async function getRewardsController(_req, res) {
  const rewards = await getRewards();
  res.json(rewards);
}

async function spendRewardsController(req, res) {
  try {
    const result = await spendReward(req.body.rewardId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { getRewardsController, spendRewardsController };
