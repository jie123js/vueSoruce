const express = require('express');
const url = require('url')
const mime = require('mime');
const app = express();
// const static = require('./middleware/static') 内置的中间件
const path = require('path')

// 静态文件中间件  根据路径访问返回对应的文件
// 1.中间件的功能可以实现复用
// 2.可以在req和res上进行扩展(属性和方法), 继续走后续逻辑
// 3.中间件可以决定是否向下执行 （拦截器）

// 映射路径
app.use(express.static(path.resolve(__dirname,'a')))
app.use(express.static(path.resolve(__dirname)))

app.all('*',function(req,res){
    res.end('*')
})
app.listen(3000, function () {
    console.log('server start 3000')
})