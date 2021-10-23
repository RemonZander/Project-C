/*
SQLyog Ultimate v10.00 Beta1
MySQL - 5.5.5-10.4.14-MariaDB : Database - kyndadatabase
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`kyndadatabase` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `kyndadatabase`;

/*Table structure for table `company` */

DROP TABLE IF EXISTS `company`;

CREATE TABLE `company` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Phonenumber` varchar(45) DEFAULT NULL,
  `Email` varchar(45) NOT NULL,
  `Country` varchar(50) NOT NULL,
  `City` varchar(50) NOT NULL,
  `Postcode` varchar(10) NOT NULL,
  `Streetname` varchar(50) NOT NULL,
  `Housenumber` varchar(10) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Table structure for table `foto` */

DROP TABLE IF EXISTS `foto`;

CREATE TABLE `foto` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Filepath` varchar(45) NOT NULL,
  `Created_at` datetime NOT NULL,
  `Updated_at` datetime DEFAULT NULL,
  `Company_id` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Company_id` (`Company_id`),
  CONSTRAINT `foto_ibfk_1` FOREIGN KEY (`Company_id`) REFERENCES `company` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Table structure for table `role` */

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `template` */

DROP TABLE IF EXISTS `template`;

CREATE TABLE `template` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Filepath` varchar(45) NOT NULL,
  `Created_at` datetime NOT NULL,
  `Updated_at` datetime DEFAULT NULL,
  `Downloads` int(11) DEFAULT NULL,
  `Verified` tinyint(4) NOT NULL,
  `Company_id` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Company_id` (`Company_id`),
  CONSTRAINT `template_ibfk_1` FOREIGN KEY (`Company_id`) REFERENCES `company` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  `Role_Id` int(11) NOT NULL,
  `Comapany_Id` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Role_Id` (`Role_Id`),
  KEY `Comapany_Id` (`Comapany_Id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`Role_Id`) REFERENCES `role` (`Id`),
  CONSTRAINT `user_ibfk_2` FOREIGN KEY (`Comapany_Id`) REFERENCES `company` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
