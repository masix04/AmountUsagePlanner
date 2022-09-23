/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.5.5-10.4.19-MariaDB : Database - amount_usage_planner
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `amount_usage_planner`;

/*Table structure for table `amount` */

DROP TABLE IF EXISTS `amount`;

CREATE TABLE `amount` (
  `id` int(20) NOT NULL,
  `type` varchar(168) DEFAULT NULL,
  `month` varchar(255) DEFAULT NULL,
  `year` int(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `amount` */

/*Table structure for table `save_plan` */

DROP TABLE IF EXISTS `save_plan`;

CREATE TABLE `save_plan` (
  `amount_id` int(20) DEFAULT NULL,
  `id` int(10) NOT NULL,
  `key_name` varchar(255) DEFAULT NULL,
  `planned_percentage` mediumint(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_save_plan_amount_id` (`amount_id`),
  CONSTRAINT `fk_save_plan_amount_id` FOREIGN KEY (`amount_id`) REFERENCES `amount` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `save_plan` */

/*Table structure for table `used_amount` */

DROP TABLE IF EXISTS `used_amount`;

CREATE TABLE `used_amount` (
  `key_id` int(10) DEFAULT NULL,
  `used_amount` int(11) DEFAULT NULL,
  `used_percentage` mediumint(10) DEFAULT NULL,
  KEY `fk_used_amount_key_id` (`key_id`),
  CONSTRAINT `fk_used_amount_key_id` FOREIGN KEY (`key_id`) REFERENCES `save_plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `used_amount` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
