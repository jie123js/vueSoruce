const mongoose = require('mongoose');

// 1.链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/school', function (err) {
    if (err) {
        return console.log('链接数据库失败')
    }
    console.log('链接数据库成功')
})
// 2.约束存储的格式 骨架 schema
const UserModel = require('./model/user'); // 数据全部都可以采用用模型来进行处理
const ArticleModel = require('./model/article')

let userList = [];
for (let i = 0; i < 20; i++) {
    // 多的字段不会存入
    userList.push({ username: 'zf' + i, age: i, gender: 0, xx: 'xxx' })
}

// 增加：

// ;(async ()=>{
//     let users = await UserModel.create(userList);
//     console.log(users);
// })()


// 基本查询和分页查询：
// ;(async()=>{
//     // 支持正则匹配， 包括那些常见的模式匹配全部都支持
//     // $in $or $not $gt $lt $lte
//     // 分页查询  可以链式调用同时内部会自己维护调用的顺序 
//     // 先排序 在跳过，在限制  默认调用skit,sort,limit的时候都是在做记录操作
//     // 用了async await 都不用exec了
//     let currentPage = 4
//     let limit = 3;
//     let users = await UserModel.find({}).limit(limit).skip((currentPage-1) * limit).sort({age:-1});
// })()

// 关联查询  mongo的查询肯定不会比mysql 方便
// 用户表 -> 文章列表


; (async () => {
    let user = await UserModel.create({ username: 'zs' });

    let article = await ArticleModel.create({ user_id: user._id, title: '文章', content: 'mongoose学习' })


    // 知道了文章的id如何查询用户?
    //let article = await ArticleModel.findById('6231ede3defc5e8173bbd827'); //  具体的某一个文档

    // 1代表的是只显示某一个字段
    // 0就代表不显示 但是0和1 不能通用  
    // a说我不显示 其他人显示
    // b说只能我显示 其他人不显示
    // c?  _id 除外
    //let user = await UserModel.findById(article.user_id,{username:1,_id:1})


    // 查询两次可以么？ 能变成查询一次么？ 这个没法一次就查询到
    // “聚合”查询 可以把相关的逻辑都放到一起 


    // aggreate 95% 这个方法的使用率是最高的
    // 其他的封装的方法
    // redis key:value
})();


// 删除：


// 为了测试
setTimeout(() => {
    mongoose.disconnect()
}, 1000)