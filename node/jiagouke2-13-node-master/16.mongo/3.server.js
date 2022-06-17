const mongoose = require('mongoose');
const crypto = require('crypto')
mongoose.connect('mongodb://localhost:27017/school', function () {
    console.log('数据库链接成功')
});

const UserModel = require('./model/user');
const ArticleModel = require('./model/article');
const CateModel = require('./model/cate');
const user = require('./model/user');



(async () => {
   // 用户注册时候 我希望直接将密码转成md5  

    // 我们希望可以扩展一个方法 可以保存密码的时候 自动转化成md5。 用户修改密码

    // const user = await UserModel.findByName('zf8',{username:1,password:1}); // statics
    // user.password = crypto.createHash('md5').update('123').digest('base64');
    // user.saveMd5('123'); // methods


    // 增加钩子 
    // let query = {password:'123'}
    // let user = UserModel.find(query);   // 针对的是某一个查询 
    // user.pre(function(){ // 这里可以在查询之前 做某些时
    //     // query.password =  crypto.createHash('md5').update(query.password).digest('base64');
    //     console.log(query)
    // })
    // let u = await user.exec();
    // console.log(u);


    // 我们希望在对用户保存的时候就做某件事
    let user = await UserModel.findByName('zf8',{username:1,password:1}); // statics
    user.password = crypto.createHash('md5').update('456').digest('base64');
    await user.save();

    console.log('ok')

})()


setTimeout(() => {
    mongoose.disconnect()
}, 1000)