require('dotenv').config();

const args = process.argv.slice(2);
const fs = require('fs');
const path = require('path');
const DBManager = new (require('./server/db/DBManager').DBManager)();

if (args[0].toLowerCase() === 'testdb.sql') {
    try {
        fs.unlinkSync(__dirname + '/kyndaDatabase.sqlite3');
        console.log('Test database removed.');
    } catch (err) {
        console.error(err);
    }
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

conn.runStatement(`INSERT INTO role (Name) VALUES ('admin'), ('hoofdgbr'), ('gbr')`);

conn.runStatement(
    `INSERT INTO user
     (Email, Password, Role_Id, Company_Id, Is_logged_on) VALUES
     ('admin@gmail.com', 'Admin1!', 1, -1, FALSE),
     ('hoogfgbr1@gmail.com', 'Hoofdgbr1!', 2, 1, FALSE),
     ('hoogfgbr2@gmail.com', 'Hoofdgbr1!', 2, 2, FALSE),
     ('hoogfgbr3@gmail.com', 'Hoofdgbr1!', 2, 3, FALSE),
     ('gbr@gmail.com', 'Gbr1!', 3, 1, FALSE),
     ('gbr1@gmail.com', 'Gbr1!', 3, 2, FALSE),
     ('gbr2@gmail.com', 'Gbr1!', 3, 3, FALSE)
     `
);

conn.runStatement(
    `INSERT INTO company (Name, Phonenumber, Email, Country, City, Postcode, Streetname, Housenumber) VALUES
     ('Google', '0123456789', 'google@gmail.com', 'everywhere', 'yours', 'allofthem', 'inyourhouse', '∞'),
     ('Meta(Facebook)', '98765432310', 'notfacebook@gmail.com', 'Verenigde Staten', 'Menlo Park', 'CA94025', 'Hacker Way', '1'),
     ('Hogeschool Rotterdam', '+31107944000', 'hr@gmail.com', 'Nederland', 'Rotterdam', '3011WN', 'Wijnhaven', '107')`
);

// DB CONNECTION END
conn.endConnection();
