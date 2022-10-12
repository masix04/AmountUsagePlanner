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
  `value` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `amount` */

insert  into `amount`(`id`,`type`,`month`,`year`,`value`) values (1,'Salary','November',2022,85400),(2,'Salary','October',2022,54000),(3,'Salary','September',2022,45000),(4,'Salary','August',2022,40000),(5,'Salary','October',2021,25000);

/*Table structure for table `save_plan` */

DROP TABLE IF EXISTS `save_plan`;

CREATE TABLE `save_plan` (
  `id` int(10) NOT NULL,
  `key_name` varchar(255) DEFAULT NULL,
  `planned_percentage` mediumint(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `save_plan` */

insert  into `save_plan`(`id`,`key_name`,`planned_percentage`) values (1,'hidden_save',25),(2,'next_year_slaughter',8),(3,'young_given1',1),(4,'young_given2',1),(5,'emergency_cause',25),(6,'fuel',10),(7,'entertain',7),(8,'given_away',3),(9,'parent_given',7),(10,'on_my_self',6),(11,'home_related',5),(12,'car_related',2);

/*Table structure for table `used_amount` */

DROP TABLE IF EXISTS `used_amount`;

CREATE TABLE `used_amount` (
  `key_id` int(10) DEFAULT NULL,
  `used_amount` int(11) DEFAULT 0,
  `used_percentage` float DEFAULT 0,
  `amount_id` int(20) NOT NULL,
  KEY `fk_used_amount_key_id` (`key_id`),
  KEY `fk_used_amount_amount_id` (`amount_id`),
  CONSTRAINT `fk_used_amount_amount_id` FOREIGN KEY (`amount_id`) REFERENCES `amount` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_used_amount_key_id` FOREIGN KEY (`key_id`) REFERENCES `save_plan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `used_amount` */

insert  into `used_amount`(`key_id`,`used_amount`,`used_percentage`,`amount_id`) values (8,100,0.222222,3),(6,1500,2.77778,2),(9,650,1.44444,3),(3,700,1.55556,3),(4,700,1.55556,3),(6,2000,4.44444,3),(6,2000,4.44444,3),(2,22200,49.3333,3),(1,22200,49.3333,3),(12,0,0,3),(7,45222,100.493,3),(7,-45222,-100.493,3),(7,400,0.888889,3),(1,13500,25,2),(1,13500,30,3),(1,-13500,-30,3),(1,11250,25,3);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
