require('dotenv').config();

const args = process.argv.slice(2);
const fs = require('fs');
const path = require('path');
const DBManager = new (require('./server/db/DBManager').DBManager)();

if (args.includes('restore')) {
    try {
        fs.unlinkSync(__dirname + '/kyndaDatabase.sqlite3');
        console.log('Database removed. A new one will be created');
    } catch (err) {
        console.error(err);
        process.exit();
    }
}

const sqlData = fs
    .readFileSync(path.join(__dirname, 'testDB.sql'), { flag: 'r' })
    .toString()
    .trim()
    .split(';');

const conn = DBManager.startConnection();

for (let i = 0; i < sqlData.length; i++) {
    const query = sqlData[i];

    if (query.length !== 0) {
        conn.createQuery(query, []);
    }
}

conn.runStatements();

// Example
// conn.runStatement("INSERT INTO role (Name) VALUES (?)", ["Admin"]);

// conn.db.all("SELECT * FROM role", (err, rows) => {
//     if (err) throw err;
//     console.log(rows);
// })

conn.endConnection();
