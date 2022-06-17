function Layer(path, handler) {
    this.path = path;
    this.handler = handler
}
Layer.prototype.match = function (pathname) {
    if (this.path === pathname) { return true } ; // 无论中间件还是路由只要完全一样肯定就匹配到了 
    if(!this.route){
        // 中间件 
        if(this.path === '/') return true; // /表示匹配所有
        return pathname.startsWith(this.path + '/'); // 要求必须以路径开头
    }
    return;
}
Layer.prototype.handleRequest = function (req, res, next) {
    this.handler(req, res, next);
}
Layer.prototype.handleError = function (err,req, res, next) {
    if(this.handler.length === 4){ // 检查一下 参数格式是不是4个
        this.handler(err,req,res,next); // 是四个就执行
    }else{ // 不是继续将错误向下传递
        next(err);
    }
}
module.exports = Layer


// 我们将layer放到stack中