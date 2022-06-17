const Koa = require('./koa/lib/application-reduce'); // 返回的是一个类 

const app = new Koa(); // 创建一个应用的实例

// 内部会将这几个函数组合起来，一最后的为准  ctx.body = ?

// 组合的方式会将函数全部组合成一个promise, 如果第一个函数解析完毕后， 这个promise就成功了. 成功后就会将结果响应回去

// 1 3  2  5 6 4
// 我们为了保证所有逻辑正常运行 切记所有的next前面要+await 否则可能执行的结果和预期不一致
app.use( async (ctx, next) => {
    console.log(1);
    ctx.body = '1'
    await next(); // 这里没有等待下一个函数执行完毕， 这里不会等待异步执行完毕
    ctx.body = '2'
    console.log(2)
})
app.use(async (ctx, next) => {
    ctx.body = '3'
    console.log(3);
    await new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, 1000)
    })
    await next();
    ctx.body = '4'
    console.log(4)
})
app.use(async (ctx, next) => {
    console.log(5);
    ctx.body = '5'
    await next();
    ctx.body = '6'
    console.log(6)
})
app.listen(3000, () => {
    console.log('server start 3000');
})

