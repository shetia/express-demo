/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 80017
Source Host           : localhost:3306
Source Database       : abc

Target Server Type    : MYSQL
Target Server Version : 80017
File Encoding         : 65001

Date: 2019-09-25 10:10:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `userlist`
-- ----------------------------
DROP TABLE IF EXISTS `userlist`;
CREATE TABLE `userlist` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `age` int(16) DEFAULT NULL,
  `fileId` int(16) NOT NULL,
  `fileUrl` char(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of userlist
-- ----------------------------
INSERT INTO `userlist` VALUES ('69', '阿斯顿发请问', '123', '0', null);
INSERT INTO `userlist` VALUES ('70', '阿斯顿发问问', '1123123', '0', null);
INSERT INTO `userlist` VALUES ('71', '大是大非问问', '123', '0', null);
INSERT INTO `userlist` VALUES ('72', '阿斯顿发', '123123', '0', null);
INSERT INTO `userlist` VALUES ('73', '阿斯顿发', '123', '0', null);
