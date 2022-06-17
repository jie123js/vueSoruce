const express = require('./express');
const app = express();

// 中间件的作用 1） 可以决定是否向下执行  2） 扩展属性和方法  3) 做权限处理， 提出公共逻辑
// 中间如果不写路径默认就是匹配所有  默认就是/ . 中间件的匹配模式是开头路径能匹配到才可以
app.use('/', function (req, res, next) { // 不需要识别是get 还是post
    console.log(1)
    next();
    console.log(2)
})
app.use('/', function (req, res, next) {
    console.log(3)
    next();
    console.log(4)
})
app.use('/', function (req, res, next) {
    console.log(5)
    next();
    console.log(6)
})

app.get('/user', function (req, res,next) {
    next('oooo')
    // res.end('user')
})
app.get('/manager', function (req, res) {
    res.end('manager')
})

app.use('/', function (error, req, res, next) {
    next(error);
})
app.use('/', function (error, req, res, next) {
    res.end(error)
})
app.listen(3000, function () {
    console.log('server start 3000')
});


// express 还是面向回调的编程 。。。   koa