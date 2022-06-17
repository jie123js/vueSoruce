const express = require('./express');
const app = express();

// express 中的路由系统  根据路径和方法直接返回对应的资源

app.get('/',function(req,res){
    res.end('home')
})
app.get('/user',function(req,res){
    res.end('ok')
})
app.get('/user',function(req,res){
    res.end('get user2')
})
// app.all('*',function(req,res){
//     res.end('404')
// })
app.listen(3000,()=>{
    console.log('server start 3000')
})



const app1 = express();
app1.get('/xx',function(req,res){
    res.end('xx')
})

// 当我引入express 的时候