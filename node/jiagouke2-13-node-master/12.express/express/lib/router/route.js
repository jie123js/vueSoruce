const Layer = require("./layer")
const methods = require('methods')
function Route() {
    this.stack = [];
    this.methods = {}
}
methods.concat('all').forEach(method => {
    Route.prototype[method] = function (handlers) {
        this.methods[method] = true; // 增加标识
        if(!Array.isArray(handlers))  handlers = [...arguments]; // 不是数组就转化成数组
        handlers.forEach(handler => {
            let layer = new Layer('用不到', handler);
            layer.method = method
            this.stack.push(layer)
        })
    }
})
Route.prototype.dispatch = function (req, res, out) { // 稍后调用dispatch方法会去stack中迭代用户的回调来执行
    let idx = 0;
    let next = (err) => {
        if (err) return out(err);
        if (idx >= this.stack.length) return out();
        let layer = this.stack[idx++];
        if (layer.method === req.method.toLowerCase() || layer.method === 'all') {
            layer.handleRequest(req, res, next); // 用户的回调
        } else {
            next();
        }
    }
    next();
}
module.exports = Route

// 每个路由系统中存放的路由 都会有一个route


