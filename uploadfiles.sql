/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 80017
Source Host           : localhost:3306
Source Database       : abc

Target Server Type    : MYSQL
Target Server Version : 80017
File Encoding         : 65001

Date: 2019-09-25 14:36:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `uploadfiles`
-- ----------------------------
DROP TABLE IF EXISTS `uploadfiles`;
CREATE TABLE `uploadfiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fieldname` char(255) DEFAULT NULL,
  `encoding` char(255) DEFAULT NULL,
  `tmpName` char(255) DEFAULT NULL,
  `originalName` char(255) DEFAULT NULL,
  `mimetype` char(255) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `path` char(255) DEFAULT NULL,
  `tmpPath` char(255) DEFAULT NULL,
  `addTime` char(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of uploadfiles
-- ----------------------------
INSERT INTO `uploadfiles` VALUES ('62', 'file', '7bit', '6e819ebbc16ea39cb8f2264604e4a077', 'dissatisfied.png', 'image/png', '3635', 'uploadFiles/file/dissatisfied.png', 'D:\\demo\\express-demo\\modules/uploadFiles\\tmp\\6e819ebbc16ea39cb8f2264604e4a077', '2019-09-25T06:11:04.458Z');
INSERT INTO `uploadfiles` VALUES ('63', 'file', '7bit', '0cdfa7f54d6a228c772f18b87a3e2844', 'satisfied2.png', 'image/png', '21306', 'uploadFiles/file/satisfied2.png', 'D:\\demo\\express-demo\\modules/uploadFiles\\tmp\\0cdfa7f54d6a228c772f18b87a3e2844', '2019-09-25T06:26:39.095Z');
INSERT INTO `uploadfiles` VALUES ('64', 'file', '7bit', '424b97f726c76b5bb4dab7f4e18f71b2', 'satisfied2.png', 'image/png', '21306', 'uploadFiles/file/satisfied2.png', 'D:\\demo\\express-demo\\modules/uploadFiles\\tmp\\424b97f726c76b5bb4dab7f4e18f71b2', '2019-09-25T06:27:08.521Z');
INSERT INTO `uploadfiles` VALUES ('65', 'file', '7bit', 'e88a690e844e29ef4db2c0d66adff591', 'satisfied4.png', 'image/png', '5105', 'uploadFiles/file/satisfied4.png', 'D:\\demo\\express-demo\\modules/uploadFiles\\tmp\\e88a690e844e29ef4db2c0d66adff591', '2019-09-25T06:27:18.861Z');
INSERT INTO `uploadfiles` VALUES ('66', 'file', '7bit', 'da70e8a5b640698657e0f10e6f05c0ce', 'dissatisfied.png', 'image/png', '3635', 'uploadFiles/file/dissatisfied.png', 'D:\\demo\\express-demo\\modules/uploadFiles\\tmp\\da70e8a5b640698657e0f10e6f05c0ce', '2019-09-25T06:30:17.860Z');
INSERT INTO `uploadfiles` VALUES ('67', 'file', '7bit', '34e0b987d7fc2a7153c340eacafb2fe9', 'commonly.png', 'image/png', '3662', 'uploadFiles/file/commonly.png', 'D:\\demo\\express-demo\\modules/uploadFiles\\tmp\\34e0b987d7fc2a7153c340eacafb2fe9', '2019-09-25T06:30:26.079Z');
INSERT INTO `uploadfiles` VALUES ('68', 'file', '7bit', 'd51115194016c44c510878658dd5098f', 'satisfied.png', 'image/png', '3469', 'uploadFiles/file/satisfied.png', 'D:\\demo\\express-demo\\modules/uploadFiles\\tmp\\d51115194016c44c510878658dd5098f', '2019-09-25T06:32:41.699Z');
