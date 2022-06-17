const url = require('url');
function Router() {
    this.stack = []
}
Router.prototype.get = function (path, handler) {
    this.stack.push({
        path,
        handler,
        method: 'get'
    })
}
Router.prototype.handle = function (req, res, out) {
    let requestMethod = req.method.toLowerCase();
    let { pathname: requestUrl } = url.parse(req.url)
    for (let i = 0; i < this.stack.length; i++) {
        let route = this.stack[i];
        if (route.path === requestUrl && route.method === requestMethod) {
            return route.handler(req, res)
        }
    }
    out(req, res)

}
module.exports = Router;