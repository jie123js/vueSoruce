const express = require('./express');
const app = express();
// app.route('/').get(function(req,res){}).post(function(){})

app.get('/', function (req, res, next) { // 看一下用户是否有权限？  看一下用户参数传递是否正确？  。。。。  next表示是否向下执行
    console.log('111');
   next()
}, function (req, res, next) {
    console.log('222');
    next();
}, function (req, res, next) {
    // 真正响应的结果
    console.log('333');
    next()
})
app.put('/',function(req,res){
    res.end('post ok')
})
app.get('/',function(req,res){
    console.log(4);
    res.end('ok1')
})
app.all('/xxx',function(req,res){
    console.log(4);
    res.end('ok1')
})
app.listen(3000, function () {
    console.log('server start 3000')
})


// 我们安装了express 但是express 引用了别的模块  可以直接使用引用的别人的模块
// console.log(require('methods')); // 幽灵依赖