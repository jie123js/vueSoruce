const { Console } = require("console");

console.log(global.Buffer)
// Buffer中因为要大量操作我们的文件，所有就自己搞了一个buffer， 代表的就是内存
// 最早的时候浏览器是不支持文件读取的，但是node中需要操作文件，Buffer优点是可以和字符串相互转化

// 内存怎么表示存的是什么? 2进制 (进制转化)
// 0.1 + 0.2 为啥不等于0.3

// 0.1 十进制 0.1 转化后无法用有限的内存表示出来，所以就会出现省略的问题 （小数的运算都是近似值的运算）
// 0.0001100110011001100110011001100110011001100110011001101

// 0.2
// 0.001100110011001100110011001100110011001100110011001101

// 二进制只是对一个数的展现方式 8进制 10进制 16进制 100  掌握基本的进制转化如何实现的

// 小数转整数可以采用乘2取证法 
// 0.1 * 2 = 0.2
// 0.2 * 2= 0.4
// 0.4 * 2 = 0.8
// 0.8 * 2 = 1.6 - 1
// 0.6*2 = 1.2-1
// 0.00011  0.2 + 0.2 = 0.4 (这种计算是一种近似值的计算)


// 整数的进制转化如何实现呢？ （最小的单位叫比特位）  8bit = 字节（1个字母就有8个位组成）
// 汉字（编码）和字节的关系 ， 在node中汉字都是utf8格式， 不支持gbk  一个汉字就是3个字节
//  一个汉字有多少个位  3 * 8 = 24个位

// 将一个其他进制的值转化成10进制  当前所在位的值*进制^所在位  累加
let sum = 0;
for (let i = 0; i < 8; i++) {
    sum += 1 * Math.pow(2, i);
}
console.log(sum); // 一个字节最大就是255， ASCII (一个字符就是一个字节，因为他不会超过255)


// 我有一个8进制，每次逢8进1   0o20 16   2*8^1 + 0*8^0
// 如何将一个10进制转化成其他进制  255-》 16进制是多少？ 如果想转换成其他的进制就商进制取余数


// 我们希望将一个其他进制转换成10进制 
console.log(parseInt('10101010', 2))
console.log((0x16).toString('2')); // 可以将任何进制转化成2进制


// 0b(2)  0o(8) 0x(16)  

// base64的转化， 如何实现base32
// base64 是干嘛的 ， 为什么他要出现， 又是怎么转的呢？
// 是一种编码方式 （请求一个图片 base64就是一段文本，可以替换链接的部分，来减少请求）
// 汉字在传输的过程中可能会有乱码问题， base64
// base64 没有加密功能 （编码）
// 缺点就是转化后的结果会比原来的字符串大 （大文件不能转化成base64）

// 汉字转化成base64  无论是二进制还是16进制 还是 8进制展现的结果不同但是表现值都是相同的
// 为什么不用2进制 而用16进制展现呢?  111111111111111111111111
//   255 ->                         ff ff ff
let buffer = Buffer.from('珠');
console.log(buffer); // e7 8f a0  因为一个字节最大8个位-》 8个位最大的值就是255 -》 ff

// e7 8f a0 -> 24位， 转化后每一位不大于等于64

console.log((0xe7).toString('2'))
console.log((0x8f).toString('2'))
console.log((0xa0).toString('2'))

// 00111001   00111000   00111110     00100000

console.log(parseInt('00111001', 2))
console.log(parseInt('00111000', 2))
console.log(parseInt('00111110', 2))
console.log(parseInt('00100000', 2))
// 57 56 62 32

let code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
code += code.toLowerCase();
code += '0123456789+/';
console.log(code[57] + code[56] + code[62] + code[32]); // 54+g  base32 将值限制到32位以下这样就可以实现32位编码了


// -------------------------------------------
// Buffer就是我们的内存，buffer一旦声明就不能改变大小， 声明buffer的时候需要有一个固定的长度作为声明的依据
let buf1 = Buffer.from('珠峰'); // buffer的长度是字节为单位
let buf2 = Buffer.alloc(100); // 我要申请一个100个字节长的buffer
let buf3 = Buffer.from([100, 0x75, 0x66, 0x66, 0x65, 0x72]); // 我们很少会把一个16进制列表丢进去
console.log(buf3.toString());

// buffer很灵活可以和字符串进行相互转化

// 实现buffer的合并操作 （典型的后面的案例，类似前端上传图片。 读取文件）  buffer主要就是为了文件操作

// copy

let buf4 = Buffer.from('架构');
let buf5 = Buffer.from('珠峰');
let buf6 = Buffer.alloc(12);
// Buffer.prototype.copy = function (target, targetStart, sourceStart = 0, sourceEnd = this.length) {
//     for (let i = 0; i < sourceEnd - sourceStart; i++) {
//         target[targetStart + i] = this[sourceStart + i]
//     }
// }
// buf4.copy(buf6, 6); // 拷贝到大buffer上从第6个字节拷贝到末尾
// buf5.copy(buf6, 0, 0, 6);

// console.log(buf6); // copy方法主要的作用就是为了拼接，但是用起来麻烦

// 可以通过concat来合并buffer
Buffer.concat = function (list, len = list.reduce((a, b) => a + b.length, 0)) {
    let buf = Buffer.alloc(len);
    let offset = 0
    list.forEach(b => {
        b.copy(buf, offset);
        offset += b.length
    })
    return buf.slice(0, offset)
}
console.log(Buffer.concat([buf5, buf4], 100)); // 直接拼接起来

// buffer有slice方法可以截取buffer，截取的是内存 类似于二维数组

// let arr = [[1],2,3,4,5];   slice浅拷贝
// let arr2 = arr.slice(0,1); // [1]
// arr2[0][0] = 100;
// console.log(arr); // buffer和二维数组是一样的 

// let buf9 = Buffer.from([1,2,3,4]);
// let buf10 = buf9.slice(0,1);
// buf10[0] = 100;
// console.log(buf9)

// let str = 'abc'; // 字符串是具有不变性的
// str[0] = 'd';
// console.log(str);



let b1 = Buffer.from('珠峰爱你珠峰爱你珠峰')
Buffer.prototype.split = function (sep) {
    sep = Buffer.isBuffer(sep) ? sep : Buffer.from(sep); // 将分隔符转化成buffer，让计算的时候全部按照buffer来算

    let len = sep.length; // buffer字节长度
    let arr = [];
    let findIndex = 0;
    let offset = 0;
    while(-1 != (findIndex = this.indexOf(sep,offset))){
        arr.push(this.slice(offset,findIndex))
        offset = findIndex + len
    }
    arr.push(this.slice(offset))
    return arr;
}
console.log(b1.split('爱你'))
// console.log(b1.indexOf('爱',10)); // 对传递过来的数据来进行拆分， 来处理formdata格式


// Buffer.concat  Buffer.slice  Buffer.isBuffer  buf.indexOf