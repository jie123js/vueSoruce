function cors(){
    return function(req,res,next){
        // 写*不允许跨域携带cookie
        if(req.headers.origin){ // 有这个值就说明是跨域
            res.setHeader('Access-Control-Allow-Origin',req.headers.origin)
            res.setHeader('Access-Control-Allow-Headers','Content-Type')
            res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT,OPTIONS'); 
            res.setHeader('Access-Control-Max-Age','30'); // 预检请求的存活收件
        }
        if(req.method === 'OPTIONS'){ // options请求直接ok即可
            return res.end()
        }
    
        // 默认发送一个post请求是没有任何问题的 简单请求， 有了自定义的header就是复杂请求
    
        next();
    }
}
module.exports = cors