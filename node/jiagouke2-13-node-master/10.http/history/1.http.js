const http = require('http'); // 底层基于tcp的
const url = require('url');

// node是单线程的 如果上一个任务阻塞了代码执行，那后面就不会触发
const server = http.createServer();
let port = 3000;

server.on('request',(request,response)=>{ // request 客户端的请求   response服务端响应
    // (请求行，请求头，请求体） （响应行，响应头，响应体)
    // 行
    console.log(request.method); // 请求方法在node中都是大写的
    // 协议://用户名：密码@域名：端口号 资源路径 查询参数 锚点
    let {pathname,query} = url.parse(request.url,true)
    console.log(pathname,query); // hash值是无法获取的 （如果是hash路径是不能做seo优化）
    // 头
    console.log(request.headers); // 将所有的header全部解析成小写的

    // 请求体
    let array = []
    request.on('data',function(chunk){ // 流的内部会调用push方法
        array.push(chunk);
    });
    request.on('end',function(){ // push(null)
        // 可能请求体是一个二进制， 根据对应的格式来做转化
        console.log(Buffer.concat(array).toString())
    })
    
    response.statusCode = '200';
    response.statusMessage = 'front bug'
    response.setHeader('token','123')
    // mime
    response.setHeader('Content-Type','text/plain;charset=utf-8')
    response.end('你好'); // 响应结束

    // request 是一个可读流 on('data') on('end')  response 可写流 write() end()
    // let total = 0;
    // if(request.url === '/sum'){
    //     for(let i = 0; i < 10000000000;i++){
    //         total+=i;
    //     }
    //     response.end(total+'')
    // }else{
    //     response.end('ok')
    // }
})
server.listen(port,function(){
    console.log(`server start ${port}`); // 监听成功就会触发此函数
})
server.on('error',function(err){
    if(err.code === 'EADDRINUSE'){
        server.listen(++port)
    }
})
// 可以采用nodemon 工具来监控文件的变化，文件变化后可以自动重启  （开发的时候用nodemon  生产环境pm2）
// npm install nodemon -g