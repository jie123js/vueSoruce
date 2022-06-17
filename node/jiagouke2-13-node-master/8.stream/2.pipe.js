const createReadStream = require('./readStream');
const createWriteStream = require('./writeStream');
const fs = require('fs')
const path = require('path');

const rs = createReadStream(path.resolve(__dirname,'write.txt'),{
    highWaterMark:4 // 64k
})
const ws = createWriteStream(path.resolve(__dirname,'cop.txt'),{
    highWaterMark:4 // 16k
});

ws.write('ok')

rs.on('data',function(chunk){
    console.log(chunk)
})
// 读流导入到写流中
// rs.pipe(ws);

// ws.on('close',function(){
//     console.log('close')
// })

// 可读流 on('data') on('end')
// 可写流 write() end()

// 可读流内部具体的实现流程  
// 1) new ReadStream 创造一个可读流实例
// 2) ReflectApply(Readable, this, [options]); == Readable.call(this) 让这个ReadStream 继承Readable
// 3) 源码中有个父类 Readble 子类 ReadStream
// 4) Readble.read()  内部会去调用read方法 -》 ReadStream._read()  => fs.read()  -> Readable.push() -> this.emit('data')

// const {Readable} = require('stream')
// const fs = require('fs')
// const path = require('path');
// class MyReadStream extends Readable {
//     _read(){
//         let data = fs.readFileSync(path.resolve(__dirname,'cop.txt'))
//         this.push(data)
//         this.push(null); // 触发end
//     }
// }
// let mrs = new MyReadStream();
// mrs.on('data',function(chunk){
//     console.log(chunk)
// })

// mrs.on('end',function(){
//     console.log('end')
// })

// 可写流new WriteStream 创造一个可写流实例
// ReflectApply(Writable, this, [options]); == Writable.call(this) 让这个WriteStream 继承Writable
// Writable.write => WriteStream._write  -> fs.write()  这个流程和我们写的一致

// const { Writable } = require('stream');
// class MyWritableStream extends Writable{
//     _write(chunk,encoding,clearBuffer){
//         console.log(chunk)
//         clearBuffer()
//     }
// }
// let ws = new  MyWritableStream();
// ws.write('abc');
// ws.write('def');
// ws.write('def');