const http = require('http');

const context = require('./context');
const request = require('./request');
const response = require('./response')
const EventEmitter = require('events')
const Stream = require('stream');
class Application extends EventEmitter{
    constructor() {
        super()
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

    compose(ctx){ // redux 写法 组合函数
        // 函数链式调用
        const dispatch = (i) =>{
            // express 不支持await next() 因为调用next 返回的不是promise
            if(this.middlewares.length === i) return Promise.resolve();
            try{
                return Promise.resolve(this.middlewares[i](ctx,()=>dispatch(i+1)))
            }catch(e){
                return Promise.reject(e);
            }
        }
        return dispatch(0);
    }

    handleRequest = (req, res) => {
       


        let ctx = this.createContext(req, res);
        res.statusCode = 404; // 默认都是404
        this.compose(ctx).then(()=>{
            console.log('runner')
            let _body = ctx.body;
            if(_body){
                console.log(_body)
                if(typeof _body === 'string' || Buffer.isBuffer(_body)){
                    return res.end(_body);
                }else if(_body instanceof Stream){
                    return _body.pipe(res);
                }else if(typeof _body === 'object'){
                    return res.end(JSON.stringify(_body));
                }
            }else{
                res.end('Not Found')
            }
        }).catch((err)=>{ // 这里可以统一捕获异常
            this.emit('error',err,ctx)
        })
    }
    listen() {
        let server = http.createServer(this.handleRequest);
        server.listen(...arguments)
    }
}
module.exports = Application