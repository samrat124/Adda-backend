const fs = require('fs');
const path = require('path');

const dbFilePath = path.resolve(__dirname, '../db.json');

function readDB() {
  const data = fs.readFileSync(dbFilePath, 'utf8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
}

function getFacilities() {
  const db = readDB();
  return db.facilities;
}

module.exports = {
  readDB,
  writeDB,
  getFacilities,
};
