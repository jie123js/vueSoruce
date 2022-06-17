const fs = require('fs');
const path = require('path')
const createWriteStream = require('./writeStream')

const ws = fscreateWriteStream(path.resolve(__dirname,'write.txt'),{
    highWaterMark: 4, // 16*1024
    flags:'w'
})

// 每写4个要等到我写入成功后再写下一波  10个数 5,5
let i = 0;
function write(){
    let flag = true;
    while(flag && i<10){
        flag =  ws.write(i++ + '');
    }
//     if(i === 10){
//         ws.end('10'); // close + write
//     }
}
write();

// 0 1 2 3 第一次写入的0 是真的往文件中写入 后面的操作都写道缓存里去了， 写入成功后依次从缓存中取出来写入
ws.on('open',function(){
    console.log('open')
})
ws.on('drain',function(){ // 这个事件只有当我们写入的个数达到了highWaterMark, 并且稍后被清空了内存才会执行
    console.log('drain');
    write();
})

ws.on('close',function(){
    console.log('close')
})

// 类似于事件环的实现 