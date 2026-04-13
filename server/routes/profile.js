const express = require("express");
const controller = require("../controllers/profileController");

const router = express.Router();

router.get("/", controller.getProfileController);
router.put("/", controller.putProfileController);

module.exports = router;
