-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 14 dec 2021 om 15:46
-- Serverversie: 10.4.14-MariaDB
-- PHP-versie: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kyndadatabase`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `company`
--

CREATE TABLE `company` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Phonenumber` varchar(45) DEFAULT NULL,
  `Email` varchar(45) NOT NULL,
  `Country` varchar(50) NOT NULL,
  `City` varchar(50) NOT NULL,
  `Postcode` varchar(10) NOT NULL,
  `Streetname` varchar(50) NOT NULL,
  `Housenumber` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `design`
--

CREATE TABLE `design` (
  `Id` int(11) NOT NULL,
  `Filepath` varchar(100) NOT NULL,
  `Created_at` date NOT NULL,
  `Updated_at` date DEFAULT NULL,
  `Downloads` int(11) DEFAULT NULL,
  `Verified` tinyint(1) NOT NULL,
  `Template_id` int(11) DEFAULT NULL,
  `Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `image`
--

CREATE TABLE `image` (
  `Id` int(11) NOT NULL,
  `Filepath` varchar(100) NOT NULL,
  `Created_at` datetime NOT NULL,
  `Updated_at` datetime DEFAULT NULL,
  `Company_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `role`
--

CREATE TABLE `role` (
  `Id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Gegevens worden geëxporteerd voor tabel `role`
--

INSERT INTO `role` (`Id`, `Name`) VALUES
(2, 'Admin');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `template`
--

CREATE TABLE `template` (
  `Id` int(11) NOT NULL,
  `Filepath` varchar(100) NOT NULL,
  `Company_id` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user`
--

CREATE TABLE `user` (
  `Id` int(11) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Role_Id` int(11) NOT NULL,
  `Company_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`Id`);

--
-- Indexen voor tabel `design`
--
ALTER TABLE `design`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Template_id` (`Template_id`);

--
-- Indexen voor tabel `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `image_ibfk_1` (`Company_id`);

--
-- Indexen voor tabel `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`Id`);

--
-- Indexen voor tabel `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `template_ibfk_1` (`Company_id`);

--
-- Indexen voor tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `user_ibfk_1` (`Role_Id`),
  ADD KEY `user_ibfk_2` (`Company_Id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `company`
--
ALTER TABLE `company`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `image`
--
ALTER TABLE `image`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `role`
--
ALTER TABLE `role`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT voor een tabel `template`
--
ALTER TABLE `template`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT voor een tabel `user`
--
ALTER TABLE `user`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `design`
--
ALTER TABLE `design`
  ADD CONSTRAINT `Template_id` FOREIGN KEY (`Template_id`) REFERENCES `template` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Beperkingen voor tabel `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `image_ibfk_1` FOREIGN KEY (`Company_id`) REFERENCES `company` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Beperkingen voor tabel `template`
--
ALTER TABLE `template`
  ADD CONSTRAINT `template_ibfk_1` FOREIGN KEY (`Company_id`) REFERENCES `company` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Beperkingen voor tabel `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`Role_Id`) REFERENCES `role` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`Company_Id`) REFERENCES `company` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
