## 对比express和koa
- express 特点是源码是es5来编写的  express.Router()
- 内部采用的是回调的方式 错误处理 app.use((err,req,res,next)=>{})
- express 内置了很多的中间件 express.static 对req和res封装的中间件， express内置了路由系统  (功能多)
- express在req和res上进行了封装 实现了对原生http的扩展

> express的功能太完善了。 能不能把一些功能砍掉，只有核心逻辑。 在核心的逻辑的基础上进行扩展。 只留一个基本的功能（中间件） -》 koa 小。 回调的方式处理起来不容->promise+async+await koa源码采用了es6来编写 (所有的异步逻辑在koa中都需要包装成promise)  koa中干脆实现了一个ctx上下文来进行对req和res的代理 （用户不需要再手动使用原生的api ,这里可以手动去使用req和res）


> 整个koa的设计思想和express依旧一样， （很多中间件为了和express实现同样的功能，都拆分成了一个个的npm包）