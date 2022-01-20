BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "user" (
	"Id"	integer NOT NULL,
	"Email"	text NOT NULL UNIQUE,
	"Password"	text NOT NULL,
	"Name" text NUT NULL,
	"Role_Id"	integer NOT NULL,
	"Company_Id"	integer NOT NULL,
	FOREIGN KEY("Role_Id") REFERENCES "role"("Id"),
	PRIMARY KEY("Id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "role" (
	"Id"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	PRIMARY KEY("Id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "company" (
	"Id"	integer NOT NULL,
	"Name"	text NOT NULL UNIQUE,
	"Phonenumber"	text DEFAULT NULL,
	"Email"	text NOT NULL,
	"Country"	text NOT NULL,
	"City"	text NOT NULL,
	"Postcode"	text NOT NULL,
	"Streetname"	text NOT NULL,
	"Housenumber"	text NOT NULL,
	PRIMARY KEY("Id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "template" (
	"Id"	integer NOT NULL,
	"Filepath"	text NOT NULL,
	"Company_id"	integer NOT NULL,
	"Name"		text NOT NULL,
	UNIQUE("Name","Company_id")
	FOREIGN KEY("Company_id") REFERENCES "company"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY("Id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "design" (
	"Id"	integer NOT NULL,
	"Filepath"	text NOT NULL,
	"Created_at"	datetime NOT NULL,
	"Updated_at"	datetime DEFAULT NULL,
	"Downloads"	integer DEFAULT NULL,
	"Verified"	tinyint(4) NOT NULL,
	"Template_id"	integer NOT NULL,
	"Name"		text NOT NULL,
	UNIQUE("Name","Template_id")
	FOREIGN KEY("Template_id") REFERENCES "template"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY("Id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "image" (
	"Id"	integer NOT NULL,
	"Filepath"	text NOT NULL,
	"Created_at"	datetime NOT NULL,
	"Updated_at"	datetime DEFAULT NULL,
	"Company_id"	integer NOT NULL,
	FOREIGN KEY("Company_id") REFERENCES "company"("Id") ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY("Id" AUTOINCREMENT)
);
COMMIT;
