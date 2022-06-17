const fs = require('fs');
const path = require('path')
let ws = fs.createWriteStream(path.resolve(__dirname, 'copy.txt'), {
    flags: 'w',
    start: 0, // 你不能告诉人家写到第几位终止
    highWaterMark: 5// 16*1024 这不表示每次写几个，而是我预期用多少内存
}); // fs.write()

// write的时候只能传递 字符串和buffer  fs.write()
let f1 = ws.write('123')
console.log(f1); // true 可以给我，因为没到预期呢
f1 = ws.write('45'); // 请不要给我了，再给我就超过预期了，超过预期就会浪费内存
console.log(f1)
write();
function write() {
    if (f1 == false) return
    ws.write('789')
    ws.end('好了结束了'); // 全都完事了， 调用end会触发close事件  end = write + close
}

ws.on('drain',function(){
    console.log('12345写入成功')
    f1 = true;
    write()
})
// 1) highWaterMark表示的是什么  预期超过预期就是false （控制速率的）
// 如果我拼了命的像文件里写入内容 （我不能一起向文件中写入） 会浪费内存

// 2) 内部维护了一个缓存区，保证写入的属性不会发生错乱， 一次清空

// xxx.write()  xxx.end() 可写流



// 可读流可以搭配我们的可写流来使用 


