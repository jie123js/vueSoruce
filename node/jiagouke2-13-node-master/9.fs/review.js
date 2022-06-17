// 异步发展流程  
// 1） 借助函数来解决异步问题， 高阶函数（解决的问题，可以内置参数，可以扩展函数） 
// 2） 发布订阅模式Events模块 （观察者模式和发布订阅的区别） 
// 3） promise解决函数嵌套问题，不是真正的解决了，而是通过链式调用的方式来解决。 还是会有嵌套问题 （微任务） 
// 4） generator （生成器和迭代器的概念it.next()） 知道generator的实现原理， genrator来配和promise来解决异步问题，借助co来执行generator （掌握co的原理，异步如何迭代 回调）  
// 5） 直接采用async + await来解决了异步问题（语法糖 await 下面的代码会被放到 promise.then(()=>{})后面）

// Promise.finally Promise.race  Promise.all Promise.allSettled  能自己实现一个promise


// 浏览器的EventLoop
// 浏览器事件环的特点就是每次执行完毕一个宏任务，都会清空所有的微任务  （宏任务一次执行一个，微任务一次执行多个）
// 宏任务：script脚本，ui渲染，settimeout，用户的操作事件，ajax，messageChannel, setImmediate....
// 微任务：promise.then()  mutationObserver  queueMicrotask

// requestAnimationFrame  requestIdleCallback (渲染相关的，微任务之后执行的， 这里一般就把他们2 算作宏任务)

// 0123a45   012a345 
// Promise.resolve().then(() => {
//     console.log(0);
//     return new Promise((resolve)=>{ // queueMircroTask(()=>x.then((y)=>resolve(y))
//         resolve('a');
//     })
// }).then(res => {
//     console.log(res)
// })
// Promise.resolve().then(() => {
//     console.log(1);
// }).then(() => {
//     console.log(2);
// }).then(() => {
//     console.log(3);
// }).then(() => {
//     console.log(4);
// }).then(() => {
//     console.log(5);
// })

// promise.then的注册形式是等待这个then成功或者失败了 才能注册下一个then
// 微任务队列：['a',3]  清空队列 

// 0 1 2 3  'a' 4 5 这个结果是符合我们promiseA+规范， 在ecmascript规范中，如果返回了一个promise， 会将这个promise在次包装一个微任务



// node中的相关内容
// node能干什么事， 中间层（这里可能会读点数据库）、服务端渲染、前端工具 （用node来做服务端）
// node的模块化 （前端有哪些模块化机制 es6Module, commonjs规范，umd，amd，iife,systemjs）
// node的模块化掌握require的实现原理 （将代码读取过来后包装了一个函数，传入了module.exports 对象，用户赋值后，默认返回的就是吗module.exports） 想去导入别人的模块使用require，想给别人用，只需要给module.exports赋值 （模块的查找，模块的缓存）
//   fs.readFileSync + path.resolve/path.join  +  vm.compileFunction

// 模板引擎的实现原理 （new Function + with）  commonjs和esmodule区别

// 模块的分类 内置模块（util,events,stream）、文件模块(自己写的)、第三方模块（安装的）
// 第三方模块 如何去实现一个全局的第三方模块， 模块的版本号x.x.x


// node中全局属性 global上的属性就是全局属性 
// process (cwd,argv,env,nextTick)  node中的事件环了 （timer队列、poll队列、check） 执行顺序和浏览器是一致的 (setImmediate和setTimeout不一定谁快在主模块中，但是在i/o回调中setImmediate会高于setTimeout)
// buffer（编码默认只支持utf8） buffer中存的都是16进制   2，8,16进制的转化 toString(16)  parseInt('01010',2)  base64/base32/base16 实现原理


// buffer的核心内容 (buffer可以和字符串相互转化)
// Buffer.from(字符串/数组) Buffer.alloc() buffer.slice()截取内存  Buffer.concat()  Buffer.isBuffer() "split()""


// 文件读取来去提供的
// fs.readFile fs.writeFile 浪费内存, 需要节约内存 边读边写
// fs.open fs.read/write fs.close 借助我们的发布订阅来实现文件可读流和文件可写流

// fs.createReadStream()  on('data') on('end')
// fs.createWriteStream()  ws.write()  ws.end()  链表
// pipe 管道可以从一个地方copy到另一个地方