const url = require('url');
const Layer = require('./layer');
const Route = require('./route');
const methods = require('methods')



function Router() { // 此router 既能在初始化的时候 new Router 也能 express.Router
    let router = (req, res, next) => { // 如果函数在new的时候 返回了一个引用类型，那么this会变成这个引用类型
        // 请求来的时候会执行此回调方法, 应该去路由系统中拿出来一个个执行
        router.handle(req, res, next)
    }
    Object.setPrototypeOf(router, proto)
    router.stack = []; // 一个函数既能new 又能执行
    return router;
}
let proto = {}
proto.route = function (path) {
    let route = new Route(); // 创建route和layer产生关联
    let layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer); // 并且将layer放到路由系统中
    return route
}
methods.concat('all').forEach(method => {
    proto[method] = function (path, handlers) {
        // 需要先产生route才能创建layer
        let route = this.route(path); // 创建一个route
        route[method](handlers) // 将用户的回调传递给了route中
    }
})
proto.use = function (path, ...handlers) {
    if (typeof path === 'function') {
        handlers.unshift(path);
        path = '/'; // 默认路径就是一个/
    }
    handlers.forEach(handler => {
        let layer = new Layer(path, handler);
        layer.route = undefined; // 中间不存在route属性，可以根据这个属性来判断是不是路由
        this.stack.push(layer);
    })
}
proto.handle = function (req, res, out) {
    // let { pathname: requestUrl } = url.parse(req.url)
    let idx = 0;
    let removed = ''
    let next = (err) => { // 里层调用next出错就走到外层的next来
      
        if (idx >= this.stack.length) return out(err)
      
        let layer = this.stack[idx++];
        if(removed) { // 如果从上一个layer到下一个layer我就需要将删掉的在补回来
            req.url = removed + req.url;
            removed = '';
        }
        if (err) {
            // 处理err 一直向下找找到错误处理中间件 
            if (!layer.route) { // 中间件
                layer.handleError(err, req, res, next)
            } else {
                next(err); // 不是中间件就直接跳过
            }
        } else {
            // 路由的逻辑要匹配方法和路径， 但是中间件要求路径匹配就可以
            if (layer.match(req.url)) { // 这里要区分路由还是中间件，匹配规则不一样
                req.params = layer.params;
                if (layer.route) {
                    if (layer.route.methods[req.method.toLowerCase()]) {
                        layer.handleRequest(req, res, next);
                    } else {
                        next();
                    }
                } else {
                    // 中间件
                    if (layer.handler.length === 4) return next();
                    removed = layer.path === '/' ? '' : layer.path; // 记录删除的部分

                    req.url = req.url.slice(removed.length); // 删除需要删掉的部分

                    
                    layer.handleRequest(req, res, next);
                }
            } else { // 如果路径不匹配直接跳过
                next();
            }
        }
    }
    next();
}
module.exports = Router;





// 1) express express中的 路由的实现和layer的关系 默认路由系统中存放着多个layer, 每个layer对应一个route， route中存放的用户的回调
// 2） 路由需要匹配路径和方法   中间件只需要匹配路径（路径是模糊匹配的）
// 3) 中间件实现原理  洋葱模型  如何处理错误的 错误处理中间件   middleware
// 4) 参数路由的实现原理 /:xxx/:xxx 正则匹配 
// 5) 二级路由的实现  

// cookie + 缓存 + 压缩 原理 + jwt + 跨域 +  express中间件
// koa原理和express对比一下