const url = require('url');
const Layer = require('./layer');
const Route = require('./route');
const methods = require('methods')

function Router() {
    this.stack = []
}

Router.prototype.route = function (path) {
    let route = new Route(); // 创建route和layer产生关联
    let layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer); // 并且将layer放到路由系统中
    return route
}
methods.concat('all').forEach(method => {
    Router.prototype[method] = function (path, handlers) {
        // 需要先产生route才能创建layer
        let route = this.route(path); // 创建一个route
        route[method](handlers) // 将用户的回调传递给了route中
    }
})

Router.prototype.handle = function (req, res, out) {
    let { pathname: requestUrl } = url.parse(req.url)
    let idx = 0;
    let next = () => {
        if (idx >= this.stack.length) return out(req, res)
        let layer = this.stack[idx++]
        if (layer.match(requestUrl) && layer.route.methods[req.method.toLowerCase()]) {
            // 路径匹配到了 , 匹配到了交给route来处理，如果route处理完后，可以调用next，从上一个layer到下一个来
            layer.handleRequest(req, res, next); // 这里调用的是dispatch
        } else {
            next();
        }
    }
    next();
    // 请求到来后 我们需要去stack中进行筛查

    // for (let i = 0; i < this.stack.length; i++) {
    //     let route = this.stack[i];
    //     if (route.path === requestUrl && route.method === requestMethod) {
    //         return route.handler(req, res)
    //     }
    // }
    // out(req, res)
}
module.exports = Router;
