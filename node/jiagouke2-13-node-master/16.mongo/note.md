- homebrew 包管理器   

```
brew tap  mongodb/brew
brew install mongodb-community@5.0
brew services start  mongodb-community
```

- mongod 启动服务端
- mongo 客户端

mongo默认是27017的， 就会有人专门去搞27017端口， 数据库一定要设置密码

"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\5.0\bin\mongod.cfg" --service

robo3t   Navicat


存储数据

数据库 database
集合 Collection (表)
文档 Document (数据) 存储的数据叫BSON （这里其实你可以认为就是为json）， json中包含了更多的数据类型


- use school 切换到每个数据下
- db.createCollection('student') 创建集合
- show collections 显示集合
- db.student.insert({name:'zf'})  如果执行了插入操作 会默认创建集合  插入数据
- db.student.remove() 删除所有数据


> mongo的语法非常的丰富, 按照要求查询 ， 比较  ，逻辑运算  

- db.student.find({name:"zf19"}) 根据条件查询
- db.student.find({age:{$gt:7,$lt:9}})   模式匹配符号 $gt $lt $ne $in  
- db.student.find({$or:[{age:{$gt:3}},{age:{$lt:3}}]})
- db.student.update({age:2},{$set:{address:{num:515,info:"回龙观"}}})   修改添加数据
- 查询的时候默认都是完全匹配 所以不要采用完全匹配的方式查询
- db.student.find({"address.num":515}) 查询属性num值是515的
- db.student.find({age:3,hobby:{$all:[1,100]}}) 数组也支持
- db.student.remove({age:3})

> 前一条数据和后一条数据结构可以是不一样的， nosql （不灵活，如果做查询的时候就不灵活了）  希望存储的有点结构层次，不是乱存  一般在使用mongo的时候 还是希望让他像 关系型数据库靠拢



Mongoose 是一个非常容易的orm工具，内置了丰富的方法和校验机制 . 核心就是可以约束存储的内容



// 备份，导出  csv
// mongodump --db school --collection user --out backup
// mongorestore

// 电商网站 用户有下单记录， 直接存储到了后端。  商户希望将下单记录导出 

// mongoexport -d school -c user --csv -f name,gender -o admin.csv
// >mongoimport -d school -c test --type csv -f name,age --file test.csv


db.createUser({user:"jw",pwdL"jw",roles:[{role:"readWrite",db:"school"}]})



security:
  authorization: enabled
重新启动 use 数据库 db.auth('用户名','密码')



redis 是一个高性能的nosql数据库 mongo  典型的key:value