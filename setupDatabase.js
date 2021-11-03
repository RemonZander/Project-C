require('dotenv').config();

const args = process.argv.slice(2);
const fs = require('fs');
const path = require('path');
const DBManager = new (require('./server/db/DBManager').DBManager)();

if (args[1] === 'restore' && args[0].toLowerCase() === 'testdb.sql') {
    try {
        fs.unlinkSync(__dirname + '/kyndaDatabase.sqlite3');
        console.log('Test database removed.');
    } catch (err) {
        console.error(err);
    }

    process.exit();
}

const sqlData = fs
    .readFileSync(path.join(__dirname, args[0]), { flag: 'r' })
    .toString()
    .trim()
    .split(';');

// DB CONNECTION START
const conn = DBManager.startConnection();

for (let i = 0; i < sqlData.length; i++) {
    const query = sqlData[i];

    if (query.length !== 0) {
        conn.createQuery(query, []);
    }
}

// Deze method gebruiken we om meerdere statements achter elkaar te doen die zijn toegevoegd door de createQuery method.
// Deze method gebruik je vaak om meerdere insert statements te maken bv voor test data.
// LET OP: Hier kan je nog geen select statements mee runnen (technisch gezien wel maar er is nog geen manier
// geimplementeerd om de resultaten te bekijken)
// Gebruik de runStatement method om de resultaten te bekijken
conn.runStatements();

// Example
// Uncomment de code eronder en run "npm run db-test" voor een test.

//Deze method gebruiken we om een enkele statement te runnen.
// conn.runStatement("INSERT INTO role (Name) VALUES (?)", ["Admin"]);

// conn.runStatement("SELECT * FROM role", []).then(data => console.log(data));

// Hierin kan je functies maken die testdata aanmaken.
// Het is de bedoeling dat je alle statements in dit bestand toevoeg net als erboven.

// DB CONNECTION END
conn.endConnection();
