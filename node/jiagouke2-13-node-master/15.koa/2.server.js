const Koa = require('./koa/lib/application-reduce'); // 返回的是一个类 

const app = new Koa(); // 创建一个应用的实例


app.use(ctx=>{

    // ctx.response.body = 'ok';
    ctx.response.body = {name:'zf'}
    console.log(ctx.response.body,ctx.body)
})
app.listen(3000,()=>{
    console.log('server start 3000');
})

