const express = require("express");
const cors = require("cors");

const tasksRoute = require("./routes/tasks");
const profileRoute = require("./routes/profile");
const focusRoute = require("./routes/focus");
const rewardsRoute = require("./routes/rewards");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "LumaTasks API" });
});

app.use("/tasks", tasksRoute);
app.use("/profile", profileRoute);
app.use("/focus", focusRoute);
app.use("/rewards", rewardsRoute);

app.listen(PORT, () => {
  console.log(`LumaTasks API running on http://localhost:${PORT}`);
});
