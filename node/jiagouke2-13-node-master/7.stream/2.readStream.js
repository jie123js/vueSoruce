// const stream = require('stream')
const fs = require('fs'); // 所谓的可读流是有一个专门的模块的
// fs基于可读流实现了文件的读取。 
const path = require('path');

const createReadStream = require('./ReadStream');
let rs = createReadStream(path.resolve(__dirname, 'name.txt'), { // fs.read
    flags: 'r', // fs.open(path,flags)  const BUFFER_SIZE
    highWaterMark: 3, // 每次读取的个数 ， 如果不写默认是64k  64*1024
    start: 0, // start 和end 决定读取几个字节 （5-0） + 1
    end:4,
    autoClose: true, // 需要读取完毕后关闭
    emitClose: true, // 底层会触发一个close事件，来通知我
    // mode:0o666 // 我们的操作权限 ， 代码权限位  
})
// chmod -R 777  读写执行 421    7  (777就是最大权限 我自己可以读写执行，我自己家的人，其他人)
// 底层是基于EventEmitter来实现的
rs.on('open', function (fd) {
    console.log('open', fd)
})
let arr = []
rs.on('data', function (chunk) { // 内部会看一下用户是否绑定了data事件，如果绑定了会触发data  on('newListener')
   // console.log(chunk)
    rs.pause(); // 暂停后就不会再次触发data事件,可以消费读取到的内容，消费后再去读取
    arr.push(chunk)
    // 一般情况下，客户端给我传递了一个图片，将图片拼接好写入到文件中
})
rs.on('end', function () { // 内部会调用rs.emit('end')
    console.log(Buffer.concat(arr))
})
rs.on('close', function () {
    console.log('close')
})
rs.on('error', function (err) {
    console.log(err)
})
setInterval(() => {
    rs.resume(); // 恢复流动模式 
}, 1000)
// 只有文件才会有open 和 close

// 读取可以控制速率， 可以决定暂停读取 

// on('data')  on('end') 就是可读流 