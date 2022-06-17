const Koa = require('koa')
const path = require('path');
const fs = require('fs');
const body = require('./middlewares/bodyparser')
const app = new Koa();
const static = require('./middlewares/static')

// 当用户访问路径 /login  get请求 需要返回一个表单
// 当点击提交的时候   解析用户数据返回内容
app.use(body(path.resolve(__dirname,'upload')));
app.use(static(__dirname))

// app.use((ctx,next)=>{
//     if(ctx.path === '/login' && ctx.method === 'GET'){
//         // 返回表单
//         ctx.type = 'text/html'; // content-type:text/html
//         ctx.body = fs.createReadStream(path.resolve(__dirname,'form.html'))
//     }else{
//         return next();
//     }
// })

app.use(async (ctx,next)=>{
    if(ctx.path === '/login' && ctx.method === 'POST'){
        // 解析参数
        ctx.body = ctx.request.body
    }else{
        next();
    }
})



app.listen(3000,()=>{
    console.log('server start 3000')
})