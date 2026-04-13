const express = require("express");
const controller = require("../controllers/tasksController");

const router = express.Router();

router.get("/", controller.getTasks);
router.post("/", controller.postTask);
router.put("/:id", controller.putTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;
