const http = require('http');

const context = require('./context');
const request = require('./request');
const response = require('./response')
class Application {
    constructor() {
        // 每个应用都扩展了一个全新的request、response、context， 实现应用的隔离
        this.context = Object.create(context)
        this.request = Object.create(request);
        this.response = Object.create(response);
        this.middlewares = [];
        // this.handleRequest = this.handleRequest.bind(this)
    }
    createContext(req, res) {
        // 每次请求到来应该根据当前应用的上下文创建一个全新的上下文
        let ctx = Object.create(this.context);
        let request = Object.create(this.request);
        let response = Object.create(this.response);

        ctx.request = request; // 这个是koa中封装的属性
        ctx.request.req = ctx.req = req // 将原生的req放到了封装的request上

        ctx.response = response;
        ctx.response.res = ctx.res = res;


        return ctx; // ctx.__proto__.__proto__
    }
    use(middleware) { // 我们在使用use的时候 希望可以多次注册中间件，到时候请求到来可以一个个执行
        this.middlewares.push(middleware);
    }

    compose(ctx) { // redux 写法 组合函数
        // 函数链式调用
        // let fn = middlewares.reduce((a, b) => (...args) => Promise.resolve(a(args[0], () => Promise.resolve(b(...args)))))
        // let fn = this.middlewares.reduce((a, b) => (ctx) => Promise.resolve(() => a(b)))
        return fn(ctx,()=>Promise.resolve());
    }

    handleRequest = (req, res) => {

        let ctx = this.createContext(req, res);
        res.statusCode = 404; // 默认都是404
        this.compose(ctx).then(() => {
            let _body = ctx.body;
            if (_body) {
                if (typeof _body === 'string' || Buffer.isBuffer(_body)) {
                    return res.end(_body);
                } else if (typeof _body === 'object') {
                    return res.end(JSON.stringify(_body));
                }
            } else {
                res.end('Not Found')
            }
        }).catch((err) => {

        })
    }
    listen() {
        let server = http.createServer(this.handleRequest);
        server.listen(...arguments)
    }
}
module.exports = Application



function add(a, b) {
    return a + b;
}
function len(str) {
    return str.length;
}
function addPrefix(str) {
    return '$' + str
}

// fn返回的就是一个函数


// a = addPrefix   b= len


// a = (...args) => addPrefix(len(...args))
// b = add

// (...args) =>  (...args) => addPrefix(len(...args))(add(...args))

//(...args) =>  addPrefix(len(add(...args))


// let fn = [addPrefix, len, add].reduce((a, b) => (...args) => a(b(...args)))
// console.log(fn('a', 'b'))


let middlewares = [
    function (ctx, next) { // fn1
        console.log(1);
        next();
        console.log(2);
    },
    function (ctx, next) { // fn2
        console.log(3);
        next();
        console.log(4);
    },
    function (ctx, next) { // fn3
        console.log(5);
        next();
        console.log(6);
    }
]

//  a = fn1   b = fn2   

// a = (...args) => Promise.resolve(fn1(args[0], () => Promise.resolve(fn2(...args))))
// b = fn3


// const fn = (...args) => Promise.resolve(Promise.resolve(fn1(args[0], () => Promise.resolve(fn2((args[0], () => Promise.resolve(fn3(...args))))))))
let r = middlewares.reduce((a, b) => (...args) => Promise.resolve(a(args[0], () => Promise.resolve(b(...args)))))
// r({}, () => Promise.resolve()).then(data=>{
//     console.log(data)
// })


