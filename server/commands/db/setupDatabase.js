require("dotenv").config();

const args = process.argv.slice(2);
const fs = require("fs");
const path = require("path");
const DB = new (require("../../src/db/DB"))();
const Storage = new (require("../../src/Storage"))();
const testUri =
  "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7";

const dbPath = path.normalize(process.cwd() + "\\kyndaDatabase.sqlite3");

if (args[0].toLowerCase() === "testdb.sql" && fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    fs.rmSync(Storage.storagePath, { recursive: true, force: true });
    console.log("Succesfully deleted database");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const sqlData = fs
  .readFileSync(path.join(__dirname, args[0]), { flag: "r" })
  .toString()
  .trim()
  .split(";");

console.log("Succesfully created database.");
// DB CONNECTION START
const conn = DB.startConnection();

for (let i = 0; i < sqlData.length; i++) {
  const query = sqlData[i];

  if (query.length !== 0) {
    conn.createQuery(query, []);
  }
}

(async () => {
  console.log("Running queries...");

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

  await conn.runStatement(
    `INSERT INTO role (Name) VALUES ('Admin'), ('Moderator'), ('Employee')`
  );

  await conn.runStatement(
    `INSERT INTO user
        (Email, Password, Role_Id, Name, Company_Id) VALUES
        ('admin@gmail.com', 'Admin1!', 1, 'Amadeus Mozart', -1),
        ('moderator1@gmail.com', 'Moderator1!', 2, 'Liesje Lompkop', 1),
        ('moderator2@gmail.com', 'Moderator1!', 2, 'Pieter Pisnicht', 2),
        ('moderator3@gmail.com', 'Moderator1!', 2, 'Karen Kartoffeln', 3),
        ('user1@gmail.com', 'User1!', 3, 'Pollination Technician 1', 1),
        ('user2@gmail.com', 'User1!', 3, 'Helma Hobbelkut', 2),
        ('user3@gmail.com', 'User1!', 3, 'Qwerty Azerty', 3)`
  );

  await conn.runStatement(
    `INSERT INTO company (Name, Phonenumber, Email, Country, City, Postcode, Streetname, Housenumber) VALUES
        ('Google', '0123456789', 'google@gmail.com', 'everywhere', 'yours', 'allofthem', 'inyourhouse', '∞'),
        ('Meta(Facebook)', '98765432310', 'notfacebook@gmail.com', 'Verenigde Staten', 'Menlo Park', 'CA94025', 'Hacker Way', '1'),
        ('Hogeschool Rotterdam', '+31107944000', 'hr@gmail.com', 'Nederland', 'Rotterdam', '3011WN', 'Wijnhaven', '107')`
  );

  await conn.runStatement(
    `INSERT INTO template (Filepath, Company_id, Name) VALUES
        ('filepath_to_template', '1', 'template1_com1'),
        ('filepath_to_template', '1', 'template2_com1'),
        ('filepath_to_template', '1', 'template3_com1'),
        ('filepath_to_template', '2', 'template1_com2'),
        ('filepath_to_template', '3', 'template1_com3'),
        ('filepath_to_template', '3', 'template2_com3'),
        ('filepath_to_template', '3', 'template3_com3'),
        ('filepath_to_template', '3', 'template4_com3')`
  );

  await conn.runStatement(
    `INSERT INTO design (Filepath, Created_at, Updated_at, Downloads, Verified, Template_id, Name) VALUES
        ('filepath_to_design', '6-11-2021', '', '', FALSE, 1, 'design1_template1'),
        ('filepath_to_design', '1-10-2021', '6-11-2021', '10', TRUE, 1, 'design2_template1'),
        ('filepath_to_design', '10-11-2020', '4-5-2021', '', FALSE, 2, 'design1_template2'),
        ('filepath_to_design', '18-2-2021', '', '', FALSE, 4, 'design1_template4'),
        ('filepath_to_design', '1-3-2021', '3-3-2021', '99999999999', TRUE, 4, 'design2_template4'),
        ('filepath_to_design', '4-4-2021', '31-21-2021', '-1', TRUE, 7, 'design1_template7'),
        ('filepath_to_design', '8-7-2021', '', '', FALSE, 7, 'design2_template7'),
        ('filepath_to_design', '7-8-2021', '8-7-2021', '69', TRUE, 7, 'design3_template7'),
        ('filepath_to_design', '00-00-0000', '00-00-0000', '', FALSE, 7, 'design4_template7'),
        ('filepath_to_design', '6-11-2021', '5-2-2019', '50', FALSE, 7, 'design5_template7'),
        ('filepath_to_design', '15-8-2021', '1-1-2000', '10', TRUE, 7, 'design6_template7'),
        ('filepath_to_design', '28-5-2021', '7-6-5432', '1000', TRUE, 8, 'design1_template8')`
  );

  await Storage.addCompany(0, true);
  await Storage.addCompany(1, true);
  await Storage.addCompany(2, true);

  await conn.runStatement(
    `INSERT INTO image (Filepath, Created_at, Updated_at, Company_id) VALUES
        ('${path.normalize(
          Storage.storagePathRelative + "/0/images/test.gif"
        )}', '6-11-2021', '8-11-2021', 0)`
  );

  Storage.addImage("test.gif", 0, testUri);

  // DB CONNECTION END
  conn.endConnection();

  console.log("Queries done and DB is closed");
})();
