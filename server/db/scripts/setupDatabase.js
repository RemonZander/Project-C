const fs = require('fs');
const path = require('path');
const DBManager = new (require('../db').DBManager)();

const sqlData = fs.readFileSync(path.join(__dirname, 'dbFile.sql'), { encoding: 'utf-8', flag: 'r' });

DBManager.startConnection();

DBManager.query(sqlData);

DBManager.endConnection();

console.log('Setup database complete.');
