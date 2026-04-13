const fs = require("fs/promises");
const path = require("path");

const dataPath = (...segments) => path.join(__dirname, "..", "data", ...segments);

async function readJson(fileName) {
  const raw = await fs.readFile(dataPath(fileName), "utf-8");
  return JSON.parse(raw);
}

async function writeJson(fileName, payload) {
  await fs.writeFile(dataPath(fileName), JSON.stringify(payload, null, 2), "utf-8");
}

module.exports = { readJson, writeJson };
