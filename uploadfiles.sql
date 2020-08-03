/*
Navicat MySQL Data Transfer

Source Server         : abc
Source Server Version : 50524
Source Host           : localhost:3306
Source Database       : abc

Target Server Type    : MYSQL
Target Server Version : 50524
File Encoding         : 65001

Date: 2020-07-27 22:01:51
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for uploadfiles
-- ----------------------------
DROP TABLE IF EXISTS `uploadfiles`;
CREATE TABLE `uploadfiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fieldname` varchar(255) DEFAULT NULL,
  `originalName` varchar(255) DEFAULT NULL,
  `tmpName` varchar(255) DEFAULT NULL,
  `encoding` varchar(255) DEFAULT NULL,
  `mimetype` varchar(255) DEFAULT NULL,
  `size` double DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `tmpPath` varchar(255) DEFAULT NULL,
  `addTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
