const fs = require("fs/promises");

let DATA_FILE = "./data.json";

function setDataFile(path) {
  DATA_FILE = path;
}

async function readItems() {
  const data = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(data);
}

async function writeItems(items) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2));
}

module.exports = { readItems, writeItems, setDataFile };
