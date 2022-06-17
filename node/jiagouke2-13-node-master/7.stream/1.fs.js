// readFile  readFileSync node中的文件模块一般有两种用法 同步、异步
// 文件操作 i/o操作  读写文件 （i/o操作参照物都是内存）

// 内存的标识是用buffer来表示
const fs = require('fs');
const path = require('path');
// 读取文件要注意的是文件不存在会报错
// fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
//     // 写入操作默认会创建文件， 如果写入的文件有内容默认会清空在写入
//     if (err) return console.log(err)
//     fs.writeFile(path.resolve(__dirname, 'copy.txt'), data, function (err) {
//         if (err) return console.log(err)
//         console.log(data)
//     })
// })

// 数据过大 （2g）, 全部读取到内存中，会导致淹没可用内存。 如果特别大的文件也不能使用readFile

// 希望可以读取一部分写入一部分，不要直接全部读取到内存中 （流）

const buf = Buffer.alloc(3);
// r 读取的意思    w 写入的意思   a 追加的意思   r+(可读可写，以读为准如果文件不存在就会报错)  w+(如果文件不存在会创建)
// fs.open(path.resolve(__dirname,'name.txt'),'r',function(err,fd){ 
//     // fd file descriptor 数字
//     // 表示我要读取name.txt 将内容写入到buf中, 表示从buffer的第0个位置写，写入3个, 读取文件的位置
//     fs.read(fd,buf,0,3,0,function(err,bytesRead){ // 真实读取到的个数
//         fs.open(path.resolve(__dirname,'copy.txt'),'w',function(err,wfd){
//             // 我希望写入内容，那么需要读取buffer从第0个位置读取读到的个数,写入到文件的第0个位置
//             fs.write(wfd,buf,0,bytesRead,0,function(err,written){
//                 console.log(written)
//             })
//         })
//     })
// })
// 异步迭代需要递归
// function copy(source, target,cb) {
//     let readPosition = 0;
//     let position = 0;
//     function destroy(fd,wfd){
//         let times = 0;
//         function done(){
//             if(++times === 2){cb();}
//         }
//         fs.close(fd,done)
//         fs.close(wfd,done)
//     }
//     fs.open(source, 'r', function (err, fd) {
//         if(err) return cb(err)
//         fs.open(target, 'w', function (err, wfd) {
//             if(err) return cb(err)
//             function next(){
//                 fs.read(fd, buf, 0, 3, readPosition, function (err, bytesRead) {
//                     if(err) return cb(err)
//                     readPosition += bytesRead;
//                     fs.write(wfd, buf, 0, bytesRead, position, function (err, written) {
//                         if(err) return cb(err)
//                         position += written;
//                         if(bytesRead <3) return destroy(fd,wfd); // 读取不到内容就关闭
//                         next();
//                     })
//                 })
//             }
//             next(); // 异步迭代可以通过递归函数来实现
//         })
//     });
// }

function copy(source, target, cb) {
    let rs = fs.createReadStream(source, { highWaterMark: 4 });
    let ws = fs.createWriteStream(target, { highWaterMark: 1 });
    rs.on('data', function (chunk) {
        let flag = ws.write(chunk);
        if (!flag) {
            rs.pause();
        }
    })
    ws.on('drain', function () {
        console.log('drain');
        rs.resume();
    })
}
copy(path.resolve(__dirname, 'name.txt'), path.resolve(__dirname, 'copy.txt'), function (err) {
    console.log('cp ok')
})

// 写起来复杂, 而且读和写之间是没有任何关系（不需要等到打开source，再去打开target。 这样的代码不好维护，全部代码耦合在了一起）
// 发布订阅 （可以解决异步问题 ， 可以解耦合） 可读流  pipe  可写流


// 下次课写一下这个可写流的实现原理 ， 再去简化copy逻辑
// 在看一下其他的流，掌握流的特性