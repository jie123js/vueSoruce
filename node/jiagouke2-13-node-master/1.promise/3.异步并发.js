// 异步要等待同步代码执行之后在执行


// code runner 可以直接右键执行代码
const fs = require('fs'); // file system  fs.readFile v16.13.0

const path = require('path')

// 确定文件的所在路径  node的异步api的特点都需要传递一个回调函数 函数的参数有两个第一个永远是错误
// error-first
// let times = 0; // 计数，用来掌握异步执行了几次
// let school = {}
// function out(){
//     if(++times == 3){
//         console.log(school)
//     }
// }
function after(times, callback) { // 高阶函数来解决异步并发问题
    let data = {}
    return function (key, value) { // out
        data[key] = value;
        if(--times === 0){
            callback(data);
        }
    }
}
let out = after(2, (data) => {
    console.log(data)
})
fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
    console.log(__dirname);
    console.log(path.resolve(__dirname, 'age.txt'));
    console.log(path.resolve(__dirname, '../age.txt'));
    out('age', data);
})
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
    out('name', data);
})

// 思考如何拿到最终的两个异步的结果 （“同步异步的结果”）
// 发布订阅模式，可以监控到每次完成的情况，而且可以自己控制逻辑

