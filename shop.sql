-- 商品表 --
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '商品名称',
  `goods_id` varchar(50) NOT NULL DEFAULT '0' COMMENT '商品编号',
  `goods_desc` varchar(255) NOT NULL DEFAULT '',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `primary_pic_url` varchar(255) NOT NULL COMMENT '商品主图',
  `stock` int(11) NOT NULL COMMENT '库存',
  `created_at` bigint NOT NULL DEFAULT '0',
  `update_at` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品表记录
BEGIN;
INSERT INTO `goods` VALUES (1, '睡枕', 100, '多功能睡枕', 89.00, 'http://yanxuan.nosdn.127.net/c8ca0600fa7ba11ca8be6a3173dd38c9.png', 500,0, 0);
INSERT INTO `goods` VALUES (2, '钢笔', 101,'暗黑简约', 39.90, 'http://yanxuan.nosdn.127.net/97ad483a94ed88216a989df83e39cbf0.png', 200,0, 0);
COMMIT;

-- 订单表
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` varchar(50) NOT NULL DEFAULT '订单编号',
  `goods_id` varchar(50) NOT NULL DEFAULT '0' COMMENT '商品编号',
  `user_id` varchar(50) NOT NULL DEFAULT '0',
  `order_status` tinyint(1) unsigned NOT NULL COMMENT '0: 创建成功 1: 支付成功 2: 支付失败',
  `order_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '订单总价',
  `created_at` bigint NOT NULL DEFAULT '0',
  `update_at` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
