const { getProfile, saveProfile, applyProgress } = require("../services/profileService");

async function getProfileController(_req, res) {
  const profile = await getProfile();
  res.json(applyProgress(profile));
}

async function putProfileController(req, res) {
  const current = await getProfile();
  const merged = applyProgress({ ...current, ...req.body });
  await saveProfile(merged);
  res.json(merged);
}

module.exports = { getProfileController, putProfileController };
