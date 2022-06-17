const Koa = require('koa')
const path = require('path');
const fs = require('fs');
const body = require('./middlewares/bodyparser')
const app = new Koa();
const static = require('./middlewares/static')
const Router = require('./middlewares/router')

// 可以用来统计 路由访问的时间 借助洋葱模型
app.keys = ['zf'];
let r= require('crypto').createHmac('sha1','zf').update('name=tobi').digest('base64');
app.use(async (ctx,next)=>{ // 可以计算路由的执行时间, 洋葱模型唯一我看到的使用价值
    console.time('timer')
    await next()
    console.timeEnd('timer')
});

// 串行值的思想
const router = new Router();
router.get('/add',async function(ctx,next){
    console.log(1);
    await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },1000)
    });
    await next();
})
router.get('/add',async function(ctx,next){
    ctx.cookies.set('name', 'tobi', { signed: true }); // 需要有一个秘钥 
    ctx.body = 'add'
})
router.get('/remove',async function(ctx,next){
    let cookie = ctx.cookies.get('name',{signed:true})
    ctx.body = cookie
})
// 当用户访问路径 /login  get请求 需要返回一个表单
// 当点击提交的时候   解析用户数据返回内容
app.use(body(path.resolve(__dirname,'upload')));
app.use(static(__dirname))
app.use(router.routes()); // 将路由挂载到应用上
app.use(function(ctx){
    ctx.body = 'other'
}); 

app.listen(3000,()=>{
    console.log('server start 3000')
})



