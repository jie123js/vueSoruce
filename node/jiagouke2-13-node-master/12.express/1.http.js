const http = require('http');
const server = http.createServer((req, res) => {
    // handleUserGet()
    // handleUserPost()
    if(req.url === '/user' && req.method === 'GET'){

    }else if(req.url === '/user' && req.method === 'POST'){
        
    }
})

server.listen(3000, () => {
    console.log('server start 3000')
})

// express 用于封装我们原生的http请求

// express 的特点 1） 封装了http  2） 中间件为了扩展的   3) 扩展req和res

// let {pathname} = url.parse(req.url)  req.path

// res.end(JSON.stringify({}))   res.send({})


// express中间件的实现