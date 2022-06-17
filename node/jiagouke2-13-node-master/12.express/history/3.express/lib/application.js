const http = require('http')
const Router = require('./router');
const methods = require('methods')

// App

function Application() { // 我们需要每次创建应用都产生一个路由系统，做到应用和路由之间隔离
   
}

methods.concat('all').forEach(method=>{
    Application.prototype[method] = function (path, ...handlers) {
        this.lazy_route();
        this.router[method](path, handlers);
    }
})

Application.prototype.lazy_route = function(){
    if(!this.router){
        this.router = new Router();
    }
}
Application.prototype.listen = function () {
    function done(req, res) {
        res.end(`Cannot ${req.metod} ${req.url}`)
    }
    const server = http.createServer((req, res) => {
        this.lazy_route();
        this.router.handle(req, res, done);
    });
    server.listen(...arguments)
}
module.exports = Application

// 路由和应用的耦合 -》  我们需要拆分路由和应用


// createApplication
// new Application()  注册路由， 创建服务
// new Router()  注册路由将配置存起来， 请求到来时匹配路由