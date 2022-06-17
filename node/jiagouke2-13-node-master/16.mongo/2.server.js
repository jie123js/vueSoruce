const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/school', function () {
    console.log('数据库链接成功')
});

const UserModel = require('./model/user');
const ArticleModel = require('./model/article');
const CateModel = require('./model/cate');
const user = require('./model/user');

(async () => {
    // find 数组
    // let article = await ArticleModel.findById('6231ede3defc5e8173bbd827'); 
    // let user = await UserModel.findById(article.user_id,{username:1,_id:1});
    // console.log(user)

    // let article = await ArticleModel.findById('6231ede3defc5e8173bbd827').populate('user_id',{username:1,gender:1});
    // console.log(article.user_id);
    // 这种写法，需要添加ref 而且复杂的过程 使用起来也不方便 。 增加一些聚合功能也没法做


    // 直接使用聚合的方式查询 
    // let users = await UserModel.aggregate([
    //     {$match: {username:'zf7'}}, // match就是查询条件, 查询出来的用于是一组数据 
    // ])
    // console.log(users)

    // 分组的概念

    // let users = await UserModel.aggregate([
    //     { $group: { _id: '$gender', count: { $sum: 1 } } } // _id是固定的字段，就是告诉人家以哪个字段来分组
    // ]);

    // 进行查询 显示
    // let users = await UserModel.aggregate([ // find(xxx,{username:1})
    //     { $project: { username:1} } // _id是固定的字段，就是告诉人家以哪个字段来分组
    // ]);

    // join 链接表的功能

    // let users = await  ArticleModel.aggregate([ // 用文章看用户
    //     {
    //         $lookup: {
    //             from:'user',
    //             localField:'user_id',
    //             foreignField:'_id',
    //             as: 'user' // 最终查询的结果叫user
    //         }
    //     },
    //     {
    //         $match:{
    //             _id:mongoose.Types.ObjectId('62347a7a481c303d2a8645ac')
    //         }
    //     }
    // ]);
    // console.log(users[0].user)

    // 可以通过集合来操作数据，也可以通过实例来操作数据
    // let cate = await CateModel.create({title:'mongo'})
    // // 原生的mongo 需要 有一个$set语法。 mongoose 不会覆盖以前的只是修改
    // // let article = await ArticleModel.findOneAndUpdate({_id:'62347a7a481c303d2a8645ac'},{cate_id:cate._id});
    // // console.log(article)

    // let article = await ArticleModel.findById('62347a73a30400537b2a1aaa');
    // article.cate_id = cate._id;
    // await article.save(); // 自己保存起来数据


    // 我有一个文章 我想知道她的分类 和 用户对应的都是谁  用户 角色 权限  （用户和角色 一对多的）  一个角色可以有多个权限

    let users = await ArticleModel.aggregate([
        {
            $lookup: {
                from: 'user',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $lookup: {
                from: 'cate',
                localField: 'cate_id',
                foreignField: '_id',
                as: 'cate'
            }
        },
        {
            $project:{
                user:1,
                cate:1
            }
        },
        // { // 分页
        //     $skip:1
        // },
        // {
        //     $limit:1
        // }
    ])

    console.log(users)

})()


setTimeout(() => {
    mongoose.disconnect()
}, 1000)