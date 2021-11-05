BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `user` (
	`Id`	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	`Email`	text NOT NULL UNIQUE,
	`Password`	text NOT NULL,
	`Role_Id`	integer NOT NULL,
	`Company_Id`	integer NOT NULL,
	`Is_logged_on`	BOOLEAN,
	FOREIGN KEY(`Role_Id`) REFERENCES `role`(`Id`)
);
CREATE TABLE IF NOT EXISTS `template` (
	`Id`	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	`Filepath`	text NOT NULL,
	`Created_at`	datetime NOT NULL,
	`Updated_at`	datetime DEFAULT NULL,
	`Downloads`	integer DEFAULT NULL,
	`Verified`	tinyint ( 4 ) NOT NULL,
	`Company_id`	integer NOT NULL,
	FOREIGN KEY(`Company_id`) REFERENCES `company`(`Id`)
);
CREATE TABLE IF NOT EXISTS `role` (
	`Id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`Name`	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS `foto` (
	`Id`	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	`Filepath`	text NOT NULL,
	`Created_at`	datetime NOT NULL,
	`Updated_at`	datetime DEFAULT NULL,
	`Company_id`	integer NOT NULL,
	FOREIGN KEY(`Company_id`) REFERENCES `company`(`Id`)
);
CREATE TABLE IF NOT EXISTS `company` (
	`Id`	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	`Name`	text NOT NULL UNIQUE,
	`Phonenumber`	text DEFAULT NULL,
	`Email`	text NOT NULL,
	`Country`	text NOT NULL,
	`City`	text NOT NULL,
	`Postcode`	text NOT NULL,
	`Streetname`	text NOT NULL,
	`Housenumber`	text NOT NULL
);
COMMIT;
