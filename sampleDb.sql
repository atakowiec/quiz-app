CREATE DATABASE  IF NOT EXISTS `quiz_database` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `quiz_database`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: quiz_database
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `avg_history`
--

DROP TABLE IF EXISTS `avg_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avg_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `avgScore` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_f740c7fde19cc3dccc3796bd14b` (`userId`),
  CONSTRAINT `FK_f740c7fde19cc3dccc3796bd14b` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avg_history`
--

LOCK TABLES `avg_history` WRITE;
/*!40000 ALTER TABLE `avg_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `avg_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Informatyka',NULL,'/assets/categories/informatyka.avif',1),(2,'Geografia',NULL,'/assets/categories/geografia.avif',1),(3,'Chemia',NULL,'/assets/categories/chemia.avif',1),(4,'Lektury',NULL,'/assets/categories/lektury.avif',1);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `color`
--

DROP TABLE IF EXISTS `color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `color` (
  `id` int NOT NULL AUTO_INCREMENT,
  `color` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color`
--

LOCK TABLES `color` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;
/*!40000 ALTER TABLE `color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distractor`
--

DROP TABLE IF EXISTS `distractor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distractor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `questionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_dc9f80f94c46a9109fc98a9b86f` (`questionId`),
  CONSTRAINT `FK_dc9f80f94c46a9109fc98a9b86f` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distractor`
--

LOCK TABLES `distractor` WRITE;
/*!40000 ALTER TABLE `distractor` DISABLE KEYS */;
INSERT INTO `distractor` VALUES (1,'To program komputerowy do analizy danych.',1),(2,'To zestaw danych przechowywanych w bazie danych.',1),(3,'To rodzaj systemu operacyjnego.',1),(4,'To język wykorzystywany do obsługi baz danych.',2),(5,'To język programowania do tworzenia aplikacji mobilnych.',2),(6,'To język tylko do nauki matematyki.',2),(7,'To aplikacja do edytowania dokumentów tekstowych.',3),(8,'To narzędzie do tworzenia stron internetowych.',3),(9,'To urządzenie służące do przechowywania danych.',3),(10,'Przechowuje dane na dysku twardym.',4),(11,'Zarządza komunikacją między użytkownikiem a komputerem.',4),(12,'Tworzy interfejs użytkownika.',4),(13,'To specjalny typ lokalnej sieci komputerowej.',5),(14,'To usługa do zarządzania urządzeniami mobilnymi.',5),(15,'To rodzaj fizycznego dysku do przechowywania danych.',5),(16,'To program służący do edytowania tekstów.',6),(17,'To rodzaj urządzenia peryferyjnego podłączanego do komputera.',6),(18,'To system operacyjny umożliwiający komunikację między komputerami.',6),(19,'To proces kompresji danych w celu ich przechowywania.',7),(20,'To metoda ochrony danych przed nieautoryzowanym dostępem.',7),(21,'To technika zabezpieczania sieci komputerowych przed atakami.',7),(22,'User Registration Link – link do formularza rejestracji użytkownika.',8),(23,'Universal Resource Locator – uniwersalny system lokalizacji zasobów.',8),(24,'Unified Resource Locator – zintegrowany system lokalizacji zasobów.',8),(25,'To rodzaj pamięci do trwałego przechowywania danych, jak dysk twardy.',9),(26,'To urządzenie służące do przechowywania danych w chmurze.',9),(27,'To pamięć tylko do przechowywania zdjęć i plików multimedialnych.',9),(28,'To język programowania do tworzenia aplikacji mobilnych.',10),(29,'To język skryptowy służący do zarządzania bazami danych.',10),(30,'To system operacyjny przeznaczony do serwerów.',10),(31,'Nil',11),(32,'Mississippi',11),(33,'Yangtze',11),(34,'Lyon',12),(35,'Marsylia',12),(36,'Tuluza',12),(37,'Na K2 w Karakorum',13),(38,'Na Mont Blanc w Alpach',13),(39,'Na Kilimandżaro w Afryce',13),(40,'Ponad 500 000 km²',14),(41,'Ponad 250 000 km²',14),(42,'Ponad 150 000 km²',14),(43,'Morze Czerwone',15),(44,'Morze Północne',15),(45,'Morze Kaspijskie',15),(46,'1912 rok',16),(47,'1916 rok',16),(48,'1920 rok',16),(49,'Indie',17),(50,'USA',17),(51,'Rosja',17),(52,'To wyspa w Grecji',18),(53,'To miasto w Belgii',18),(54,'To rzeka w Niemczech',18),(55,'Jezioro Titicaca w Peru',19),(56,'Jezioro Wiktorii w Afryce',19),(57,'Jezioro Górne w USA',19),(58,'To wyspa w Arktyce.',20),(59,'To państwo na południowym zachodzie Australii.',20),(60,'To morze w pobliżu Antarktydy.',20),(61,'Cząstka, która tworzy cząsteczki chemiczne.',21),(62,'Cząstka, która nie może istnieć samodzielnie.',21),(63,'Jednostka chemiczna, która występuje tylko w gazach.',21),(64,'CO2',22),(65,'O2',22),(66,'CH4',22),(67,'Proces, w którym zmieniają się tylko właściwości fizyczne substancji.',23),(68,'Proces, w którym cząsteczki jednej substancji rozpuszczają się w drugiej.',23),(69,'Proces, w którym zmieniają się tylko stany skupienia substancji.',23),(70,'Związek chemiczny, który w wodzie uwalnia jony wodorotlenowe (OH-).',24),(71,'Związek chemiczny, który nie reaguje z wodą.',24),(72,'Związek chemiczny, który w wodzie tworzy cząsteczki.',24),(73,'Substancja, która składa się z różnych atomów.',25),(74,'Substancja, która nie może łączyć się z innymi substancjami.',25),(75,'Substancja, która jest zawsze stała w temperaturze pokojowej.',25),(76,'Ag',26),(77,'Pb',26),(78,'Fe',26),(79,'Wiązanie chemiczne, w którym atomy przekazują swoje elektrony.',27),(80,'Wiązanie chemiczne, w którym atomy przyciągają się nawzajem.',27),(81,'Wiązanie chemiczne, które występuje tylko w gazach szlachetnych.',27),(82,'Reakcja chemiczna, w której nie zachodzą zmiany w stanie utlenienia.',28),(83,'Reakcja chemiczna, w której dochodzi tylko do utleniania.',28),(84,'Reakcja chemiczna, w której dochodzi tylko do redukcji.',28),(85,'Jest to kwas o wzorze HCl, używany głównie w laboratoriach.',29),(86,'Jest to kwas o wzorze HNO3, wykorzystywany w produkcji nawozów.',29),(87,'Jest to kwas o wzorze H2CO3, występujący w napojach gazowanych.',29),(88,'Gaz szlachetny to gaz, który łatwo reaguje z innymi pierwiastkami.',30),(89,'Gaz szlachetny to gaz, który może tworzyć silne kwasy.',30),(90,'Gaz szlachetny to gaz, który występuje tylko w atmosferze Ziemi.',30),(91,'C.S. Lewis',31),(92,'George R.R. Martin',31),(93,'J.K. Rowling',31),(94,'W Moskwie, Rosja',32),(95,'W Paryżu, Francja',32),(96,'W Londynie, Anglia',32),(97,'Jacek Soplica',33),(98,'Zosia',33),(99,'Rokoski',33),(100,'Symbolizuje nadzieję na lepszą przyszłość.',34),(101,'Symbolizuje naturalną siłę ludzkich emocji.',34),(102,'Symbolizuje zniszczenie polskiej kultury.',34),(103,'Henryk Sienkiewicz',35),(104,'Adam Mickiewicz',35),(105,'Zofia Nałkowska',35),(106,'Upadek Rzeczypospolitej szlacheckiej.',36),(107,'Wielka wojna z Napoleonem.',36),(108,'Życie codzienne w czasach saskich.',36),(109,'Aldous Huxley',37),(110,'Erich Maria Remarque',37),(111,'John Steinbeck',37),(112,'W Polsce',38),(113,'W Niemczech',38),(114,'W Anglii',38),(115,'Juliusz Słowacki',39),(116,'Cyprian Kamil Norwid',39),(117,'Stanisław Wyspiański',39);
/*!40000 ALTER TABLE `distractor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend_request`
--

DROP TABLE IF EXISTS `friend_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friend_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `inviter` int DEFAULT NULL,
  `invitee` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_d7046d09792a5a70cbfc5b0c8c0` (`inviter`),
  KEY `FK_666368a56cd8bd4a02b7e5a2835` (`invitee`),
  CONSTRAINT `FK_666368a56cd8bd4a02b7e5a2835` FOREIGN KEY (`invitee`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_d7046d09792a5a70cbfc5b0c8c0` FOREIGN KEY (`inviter`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend_request`
--

LOCK TABLES `friend_request` WRITE;
/*!40000 ALTER TABLE `friend_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friendship`
--

DROP TABLE IF EXISTS `friendship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friendship` (
  `id` int NOT NULL AUTO_INCREMENT,
  `since` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_1` int DEFAULT NULL,
  `user_2` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_e96e3c6f2f9252d2eb91282708c` (`user_1`),
  KEY `FK_e9609d5f3a86e9beea599b36b68` (`user_2`),
  CONSTRAINT `FK_e9609d5f3a86e9beea599b36b68` FOREIGN KEY (`user_2`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_e96e3c6f2f9252d2eb91282708c` FOREIGN KEY (`user_1`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friendship`
--

LOCK TABLES `friendship` WRITE;
/*!40000 ALTER TABLE `friendship` DISABLE KEYS */;
/*!40000 ALTER TABLE `friendship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_history`
--

DROP TABLE IF EXISTS `game_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_history` (
  `id` varchar(255) NOT NULL,
  `gameType` varchar(255) NOT NULL,
  `dateTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_history`
--

LOCK TABLES `game_history` WRITE;
/*!40000 ALTER TABLE `game_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` varchar(500) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `correctAnswer` varchar(255) NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'Co to jest algorytm?',NULL,'Jest to skończony zbiór instrukcji, które prowadzą do rozwiązania problemu.',1,'2024-12-10 14:54:02','2024-12-10 14:54:02'),(2,'Czym jest język programowania Python?',NULL,'Jest to język programowania wysokiego poziomu, znany ze swojej czytelności i prostoty.',1,'2024-12-10 14:54:13','2024-12-10 14:54:13'),(3,'Co to jest system operacyjny?',NULL,'To oprogramowanie, które zarządza zasobami komputera i umożliwia uruchamianie aplikacji.',1,'2024-12-10 14:54:17','2024-12-10 14:54:17'),(4,'Jakie jest zadanie procesora w komputerze?',NULL,'Procesor przetwarza dane i wykonuje instrukcje programów.',1,'2024-12-10 14:54:22','2024-12-10 14:54:22'),(5,'Co to jest chmura obliczeniowa?',NULL,'Jest to model dostarczania usług IT przez internet, obejmujący przechowywanie danych i obliczenia.',1,'2024-12-10 14:54:26','2024-12-10 14:54:26'),(6,'Co to jest sieć komputerowa?',NULL,'To zbiór komputerów i urządzeń połączonych ze sobą, umożliwiających wymianę danych.',1,'2024-12-10 14:55:00','2024-12-10 14:55:00'),(7,'Czym jest algorytm sortowania?',NULL,'Jest to zestaw kroków, które pozwalają uporządkować dane w określony sposób.',1,'2024-12-10 14:55:03','2024-12-10 14:55:03'),(8,'Co oznacza skrót URL?',NULL,'Uniform Resource Locator – adres internetowy, który wskazuje na zasób w sieci.',1,'2024-12-10 14:55:06','2024-12-10 14:55:06'),(9,'Co to jest pamięć RAM?',NULL,'Jest to pamięć operacyjna, która przechowuje dane tymczasowe używane przez procesy działające w systemie.',1,'2024-12-10 14:55:11','2024-12-10 14:55:11'),(10,'Czym jest język HTML?',NULL,'Jest to język znaczników służący do tworzenia stron internetowych.',1,'2024-12-10 14:55:15','2024-12-10 14:55:15'),(11,'Jakie jest najdłuższe rzeka na świecie?',NULL,'Amazonka',1,'2024-12-10 14:56:57','2024-12-10 14:56:57'),(12,'Jakie miasto jest stolicą Francji?',NULL,'Paryż',1,'2024-12-10 14:57:02','2024-12-10 14:57:02'),(13,'Gdzie znajduje się najwyższy szczyt świata?',NULL,'Na Mount Evereście w Himalajach',1,'2024-12-10 14:57:04','2024-12-10 14:57:04'),(14,'Jaka jest powierzchnia Polski?',NULL,'Ponad 312 000 km²',1,'2024-12-10 14:57:07','2024-12-10 14:57:07'),(15,'Jakie morze znajduje się między Europą a Afryką?',NULL,'Morze Śródziemne',1,'2024-12-10 14:57:10','2024-12-10 14:57:10'),(16,'Kiedy rozpoczęła się I wojna światowa?',NULL,'1914 rok',1,'2024-12-10 14:57:27','2024-12-10 14:57:27'),(17,'Jakie państwo ma najwięcej ludności na świecie?',NULL,'Chiny',1,'2024-12-10 14:57:30','2024-12-10 14:57:30'),(18,'Co to jest Muurberg?',NULL,'To góra w Holandii',1,'2024-12-10 14:57:33','2024-12-10 14:57:33'),(19,'Jakie jest najgłębsze jezioro na świecie?',NULL,'Jezioro Bajkał w Rosji',1,'2024-12-10 14:57:36','2024-12-10 14:57:36'),(20,'Co to jest Antarktyda?',NULL,'To kontynent pokryty lodem, leżący wokół bieguna południowego.',1,'2024-12-10 14:57:39','2024-12-10 14:57:39'),(21,'Co to jest atom?',NULL,'Najmniejsza jednostka materii, składająca się z jądra i elektronów.',1,'2024-12-10 14:57:52','2024-12-10 14:57:52'),(22,'Jaki jest wzór chemiczny wody?',NULL,'H2O',1,'2024-12-10 14:57:56','2024-12-10 14:57:56'),(23,'Co to jest reakcja chemiczna?',NULL,'Proces, w którym zachodzi przemiana substancji chemicznych w nowe substancje.',1,'2024-12-10 14:58:00','2024-12-10 14:58:00'),(24,'Co to jest kwas?',NULL,'Związek chemiczny, który w wodzie dysocjuje na jony wodorowe (H+).',1,'2024-12-10 14:58:04','2024-12-10 14:58:04'),(25,'Co to jest pierwiastek chemiczny?',NULL,'Substancja, która składa się z atomów o tej samej liczbie protonów w jądrze.',1,'2024-12-10 14:58:10','2024-12-10 14:58:10'),(26,'Jaki jest symbol chemiczny złota?',NULL,'Au',1,'2024-12-10 14:58:26','2024-12-10 14:58:26'),(27,'Co to jest wiązanie kowalencyjne?',NULL,'Wiązanie chemiczne, w którym atomy dzielą się elektronami, tworząc cząsteczkę.',1,'2024-12-10 14:58:32','2024-12-10 14:58:32'),(28,'Co to jest reakcja redoks?',NULL,'Reakcja chemiczna, w której zachodzi jednoczesna redukcja i utlenianie.',1,'2024-12-10 14:58:35','2024-12-10 14:58:35'),(29,'Co to jest kwas siarkowy?',NULL,'Jest to kwas o wzorze H2SO4, który jest silnym kwasem stosowanym w przemyśle chemicznym.',1,'2024-12-10 14:58:42','2024-12-10 14:58:42'),(30,'Czym jest gaz szlachetny?',NULL,'Gaz szlachetny to grupa pierwiastków chemicznych, które są mało reaktywne, m.in. hel, neon, argon.',1,'2024-12-10 14:58:47','2024-12-10 14:58:47'),(31,'Kto jest autorem powieści \'Władca Pierścieni\'?',NULL,'J.R.R. Tolkien',1,'2024-12-10 14:59:09','2024-12-10 14:59:09'),(32,'Gdzie toczy się akcja powieści \'Zbrodnia i kara\' Fiodora Dostojewskiego?',NULL,'W Petersburgu, Rosja',1,'2024-12-10 14:59:15','2024-12-10 14:59:15'),(33,'Kto jest głównym bohaterem \'Pana Tadeusza\' Adama Mickiewicza?',NULL,'Tadeusz Soplica',1,'2024-12-10 14:59:19','2024-12-10 14:59:19'),(34,'Co symbolizuje \'Czarny potok\' w powieści \'Wesele\' Stanisława Wyspiańskiego?',NULL,'Symbolizuje upadek ideałów narodowych i polskiej tożsamości.',1,'2024-12-10 14:59:26','2024-12-10 14:59:26'),(35,'Kto napisał powieść \'Lalka\'?',NULL,'Bolesław Prus',1,'2024-12-10 14:59:40','2024-12-10 14:59:40'),(36,'Jakie wydarzenie stanowi tło akcji \'Dziadów\' Adama Mickiewicza?',NULL,'Wydarzenia związane z narodowym zrywem i walką o niepodległość Polski.',1,'2024-12-10 14:59:43','2024-12-10 14:59:43'),(37,'Kto był autorem powieści \'Folwark zwierzęcy\'?',NULL,'George Orwell',1,'2024-12-10 14:59:46','2024-12-10 14:59:46'),(38,'W jakim kraju rozgrywa się akcja powieści \'Zbrodnia i kara\'?',NULL,'W Rosji',1,'2024-12-10 14:59:49','2024-12-10 14:59:49'),(39,'Kto jest autorem \'Pana Tadeusza\'?',NULL,'Adam Mickiewicz',1,'2024-12-10 14:59:53','2024-12-10 15:13:23');
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_category_category`
--

DROP TABLE IF EXISTS `question_category_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_category_category` (
  `questionId` int NOT NULL,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`questionId`,`categoryId`),
  KEY `IDX_7791fa96d30fceeb85c7a20269` (`questionId`),
  KEY `IDX_d8446523c66f47b2a11312e1e5` (`categoryId`),
  CONSTRAINT `FK_7791fa96d30fceeb85c7a20269f` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_d8446523c66f47b2a11312e1e5e` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_category_category`
--

LOCK TABLES `question_category_category` WRITE;
/*!40000 ALTER TABLE `question_category_category` DISABLE KEYS */;
INSERT INTO `question_category_category` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),(17,2),(18,2),(19,2),(20,2),(21,3),(22,3),(23,3),(24,3),(25,3),(26,3),(27,3),(28,3),(29,3),(30,3),(31,4),(32,4),(33,4),(34,4),(35,4),(36,4),(37,4),(38,4),(39,4);
/*!40000 ALTER TABLE `question_category_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `iconColor` varchar(255) NOT NULL DEFAULT '#5596ca',
  `permission` int NOT NULL,
  `activate` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','$2b$10$c7y4BwCo5GRD9TfCLGqI3.Arzchteoo.6Y2wslD3JgyM0X1FmAsly','admin@admin.pl','#5596ca',1,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_game`
--

DROP TABLE IF EXISTS `user_game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game` (
  `gameId` varchar(255) NOT NULL,
  `userId` int NOT NULL,
  `score` int NOT NULL,
  `place` int NOT NULL,
  PRIMARY KEY (`gameId`,`userId`),
  KEY `FK_1786ddc11e6e542cd0cd1998b8d` (`userId`),
  CONSTRAINT `FK_1786ddc11e6e542cd0cd1998b8d` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_efca7c34243bd941b730135e2c0` FOREIGN KEY (`gameId`) REFERENCES `game_history` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_game`
--

LOCK TABLES `user_game` WRITE;
/*!40000 ALTER TABLE `user_game` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_game_category_score`
--

DROP TABLE IF EXISTS `user_game_category_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_game_category_score` (
  `userGameGameId` varchar(255) NOT NULL,
  `userGameUserId` int NOT NULL,
  `categoryId` int NOT NULL,
  `score` int NOT NULL,
  PRIMARY KEY (`userGameGameId`,`userGameUserId`,`categoryId`),
  KEY `FK_124ef519182f1659588b3cad252` (`categoryId`),
  CONSTRAINT `FK_124ef519182f1659588b3cad252` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`),
  CONSTRAINT `FK_52d38c37061515ba47272a36482` FOREIGN KEY (`userGameGameId`, `userGameUserId`) REFERENCES `user_game` (`gameId`, `userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_game_category_score`
--

LOCK TABLES `user_game_category_score` WRITE;
/*!40000 ALTER TABLE `user_game_category_score` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_game_category_score` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-10 15:20:29
