const Koa = require('./koa/lib/application-reduce'); // 返回的是一个类 

const app = new Koa(); // 创建一个应用的实例

// application 整个koa应用核心代码
// context 只要指的就是ctx上下文
// request 是针对req进行了扩展 
// response 针对response进行了扩展  
// 最终将request和resonse放到了  context上，原生的req和res也会被放在context上

app.use(ctx=>{
    // ctx.body = 'ok'; // 等待这个函数全部执行完毕后才会将body对应的值写入回去  res.end()

    // request 和 response这两个对象是koa中封装的
    // req 和 res是http中原生的
    // console.log(ctx.req.url); // 这个地方不会在使用原生的了    // ctx.req
    // console.log(ctx.request.path)                           // ctx.request
    // console.log(ctx.request.req.url)                        // ctx.request.req

    // 如果我需要对请求扩展 request扩展
    console.log(ctx.path); // 最后用户使用的就是ctx.xxx         // ctx.path
   
})
app.listen(3000,()=>{
    console.log('server start 3000');
})

