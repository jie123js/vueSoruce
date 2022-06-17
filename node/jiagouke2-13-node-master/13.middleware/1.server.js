const express = require('express');
const url = require('url')
const fs = require('fs')
const path = require('path')
const mime = require('mime');
const app = express();




// ajax -> 请求的时候没有告诉 服务端我要什么？
// app.use(function(req,res,next){
//     let { query ,pathname} = url.parse(req.url,true); 
//     req.query = query;
//     req.path = pathname;
//     res.sendFile = function(filepath){
//         fs.readFile(filepath,function(err,data){
//             res.setHeader('Content-Type',mime.getType(filepath)+';charset=utf-8');
//             res.end(data)
//         })
//     }
//     res.send = function(data){ // setHeader + res.end
//         if(typeof data === 'string' || Buffer.isBuffer(data)){
//             res.setHeader('Content-Type','text/plain;charset=utf-8')
//             res.end(data)
//         }else if(typeof data === 'object'){
//             res.setHeader('Content-Type','application/json;charset=utf-8')
//             res.end(JSON.stringify(data))
//         }else if(typeof data === 'number'){
//             res.statusCode = data;
//             res.end(data+"")
//         }
//     }
//     next();
// })

app.get('/', function (req, res) {
   // 重复的功能
   res.sendFile(path.resolve(__dirname,'package.json'))
    // res.send(req.path); // 每次都需要处理的事
})
app.get('/user', function (req, res) {
    res.send(req.query); // 每次都需要处理的事
})
app.listen(3000, function () {
    console.log('server start 3000')
})