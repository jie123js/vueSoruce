
const http = require('http');
const crypto = require('crypto');

// 摘要和加密的区别？
// console.log(crypto.createHash('md5').update('2ETIPWZa1R4+LJRW3nahQw==').digest('base64')); //ICy5YqxZB1uWSwcVLSNLcA== 

//                                    盐值           内容        编码的结果
// console.log(crypto.createHmac('sha256','zf').update('123').digest('base64')); // 加盐算法

// 1.md5是不可逆的 不能通过输出反推输入
// 2.md5摘要的长度最终的结果都是一样的
// 3.只要内容不同 出来的结果就不相同  雪崩效应
// 4.内容一样摘要的结果是一一致的

// 可以通过映射表 进行反推 {123:md5}  这个算法是公开的，所以不太安全了

// 服务端设置cookie
const sign = (value) =>{
    // 默认base64 传递的值 会有+ = / 的问题 我们需要转化成对应的base64url
    return crypto.createHmac('sha256','zf').update(value).digest('base64url')
}
console.log(sign('zf'))
const server = http.createServer((req,res)=>{
    let v = []
    res.setCookie = function(key,value,options = {}){
        let args = [];
        if(options.domain){
            args.push(`domain=${options.domain}`)
        }
        if(options.path){
            args.push(`path=${options.path}`)
        }
        if(options.maxAge){
            args.push(`max-age=${options.maxAge}`)
        }
        if(options.httpOnly){
            args.push(`httpOnly=${options.httpOnly}`)
        }
        if(options.signed){ // 添加签名
            v.push(`${key}.sign = ${sign(value)}`)// 增加一个校验值 来保证值不被窜改
        }
        v.push(`${key}=${value}; ${args.join('; ')}`); 
        res.setHeader('Set-Cookie',v)
    }
    req.getCookie = function(key,options){
        let cookie = req.headers.cookie
        let cookieObj = require('querystring').parse(cookie,'; ') || {}; // a=b&c=d
        if(options.signed){ // 需要验证签名
            if(cookieObj[key+'.sign'] === sign(cookieObj[key])){ // 如果客户端带来的签名，和这个默认的值再次签名的结果一致说明没有该
                return cookieObj[key]
            }else{
                return ''; // 不正确
            }
        }
        return cookieObj[key];
    }
    if(req.url === '/read'){
        res.end(req.getCookie('name',{signed:true}) || 'empty')
    }else if(req.url === '/write'){
        // domain 域名 可以限制域名来写入cookie    可以通过域名继续划分, 合理设置cookie  不能在a.zf.cn 下给b.zf.cn下写入
        // path 可以通过路径来区分在哪个路径下可以访问cookie  可以通过路径限制cookie的使用范围  你不能在 /read下去给 /write下写入
        // 过期时间 Expires ， maxAge    设置有效期
        // httpOnly 防止客户端篡改cookie  浏览器不能通过 document.cookie来获取
        // res.setHeader('Set-Cookie',['name=zf','age=13']);


        // 需要对cookie进行防止篡改  （cookie不能存储敏感信息，因为存到了客户端上）

        res.setCookie('name','zf',{path:'/',maxAge:100,httpOnly:true,signed:true});
        res.setCookie('age','13',{path:'/',maxAge:100,httpOnly:true,signed:true});

        // md5算法 

        res.end('write ok')
    }else{
        res.end()
    }
});


server.listen(3000,()=>{
    console.log('server start 3000');
})
