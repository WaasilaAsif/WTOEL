const express = require("express");
const controller = require("../controllers/focusController");

const router = express.Router();

router.post("/start", controller.startFocus);
router.post("/fail", controller.failFocus);
router.post("/complete", controller.completeFocus);

module.exports = router;
