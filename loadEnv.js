const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

function loadEnvFiles() {
  const base = path.resolve(process.cwd(), ".env");
  const local = path.resolve(process.cwd(), ".env.local");

  if (fs.existsSync(base)) {
    dotenv.config({ path: base });
  }

  if (fs.existsSync(local)) {
    dotenv.config({ path: local, override: true });
  }
}

module.exports = { loadEnvFiles };