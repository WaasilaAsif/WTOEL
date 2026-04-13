const express = require("express");
const controller = require("../controllers/rewardsController");

const router = express.Router();

router.get("/", controller.getRewardsController);
router.post("/spend", controller.spendRewardsController);

module.exports = router;
