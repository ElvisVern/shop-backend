### 购物系统服务端

用户  than
密码  ElvisVern11

由于时间紧迫 本系统是在平时下班时间以及周末完成
第一次使用这个框架 开发过程中遇到了各种各样的坑 理解和设计实现上可能还存在一定问题

## 系统设计
 - 为了方便目前后台管理员和前台用户为同一个

 - 考虑到高并发场景下单，单Mysql读的QPS比较低，所以引入了Redis，有两个作用：✅
    1. 防止DB直接被打挂掉
    2. 防止并发扣减库存带来的超卖问题
    - 系统在启动时，自动同步库存数据到Redis, 在下单的时候扣减Redis的库存
    使用 lua脚本保证扣减操作的原子性
    - 在管理后台添加商品的时候同步库存到Redis
    - 项目不考虑支付/支付回调验证/取消订单等功能

 - 使用 adonisjs Event模块异步推送发货通知，网络异常情况做重试处理 ✅
   - 重试机制通过封装的装饰器来实现 超过一定次数后报警推送邮件通知

 - 前端按钮上添加loading限流，实现通过axios请求拦截器过滤重复的请求 ✅

 - 利用中间件`LogRequest`记录常规Http请求日志，通过Nginx实现负载均衡同时对访问信息做统计 ✅
    - 比如查看访问量最高的IP
    ```
      awk '{print $1}' access.log | sort -n |uniq -c | sort -rn | head -n 10
    ```

 - 常规的 SQL注入、CSRF、XSS 防御 ✅
     - 避免CSRF 自动携带cookie的攻击方式 使用了JWT 的认证方式
     - 使用lucid ORM 自动转义特殊字符 避免了SQL XSS以及SQL注入问题 

 - 利用中间件`CpuOverload`概率丢弃请求在服务层面确保系统稳定，针对CPU进行过载保护 ✅
 
### 还可以实现的点

 + 线上根据IP 用户进行限流

 + 后台登录系统添加登录验证码，防止被爆破登录

 + 系统上线之前通过clinicjs检测服务性能问题 内存泄漏事件循环延迟等

 + MySQL在做模糊查询会全表扫描，可以引入ES作为补充

 + 考虑后期的商品数量不断增加，为了以后方便分库分表，可以使用分布式ID 

 + 后期线上可以实现MySQL的主从分离，Redis的集群部署

 + 后端可以使用开源的prometheus搭建监控告警平台监控Nodejs事件延迟/cpu/内存/进程异常重启等

 + 前端层面也可以加上错误监控，采集数据上报到服务端做数据清洗分析添加应用性能监控，
 分析用户行为，也可以做弱网环境下的优化

### 本地开发环境配置

+ 创建数据库shop
```
CREATE SCHEMA `shop` DEFAULT CHARACTER SET utf8mb4;
```
+ 导入项目根目录下的shop.sql

+ 更改数据库配置
  .env
+ 数据库迁移
  ```
  node ace migration:run
  ```
+ 添加默认管理员用户
```
INSERT INTO `users` VALUES (1, 'than', '$argon2id$v=19$t=3,m=4096,p=1$9xAYkPKYFMMy2kBWguc5Dg$9LZhoGoY+M/NqEg38NQpYM7/pm57HRER1N/nrLJmcaw', 18664364305, 1, 0);

```
+ 安装依赖并启动
```
yarn install
yarn dev
```


