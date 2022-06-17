class Layer {
    constructor(path,method,callback){
        this.path = path;
        this.method = method;
        this.callback = callback;
    }
    match(path,method){
        return this.path === path && this.method === method
    }
}
class Router {
    constructor(){
        this.stack = []
    }
    compose(layers,ctx,out){
        const dispatch = (i)=>{
            if(i ==layers.length) return out();
            let {callback} = layers[i];
            return Promise.resolve(callback(ctx,()=>dispatch(i+1)));
        }   
        return dispatch(0);
    }
    get(path,callback){
        let layer = new Layer(path,'get',callback);
        this.stack.push(layer);
    }
    routes() { // app.use('/xx',express.Router())  router.handle
        return async (ctx, next) => {
            // 请求到来的时候会触发此中间件
            let requestMethod = ctx.method.toLowerCase();
            let requestPath = ctx.path;
            // 获取需要执行的layer
            let layers = this.stack.filter(layer=>layer.match(requestPath,requestMethod));
            return this.compose(layers,ctx,next); // express out
        }
    }
}
module.exports = Router;