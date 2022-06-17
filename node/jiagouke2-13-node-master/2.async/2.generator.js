// function* read() {
//     let a = yield 'vue';
//     console.log(a);
//     let b = yield 'react';
//     console.log(b);
//     let c = yield 'node'
//     console.log(c);
//     return '123'
// }
// let it = read(); // it.next() {value,done}
// console.log(it.next())// 遇到yield就停止此时没有赋值，第一次调用next是无意义的
// console.log(it.next('abc'));//  yield的返回值是调用(下次next的传递的参数), 
// console.log(it.next('ccc'));//  yield的返回值是调用next的传递的参数, 
// // 传参是下一次的next给上一次yield赋值

const fs = require('fs').promises; // 这里拿到的所有fs都是promise方法fs.readFile
const path = require('path');
function* read() { // 预期这样实现
    let fileName = yield fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');
    let content = yield fs.readFile(path.resolve(__dirname, fileName), 'utf8');
    return content;
}
// const co = require('co'); // 这是一个第三方模块 用之前要安装

function co(it) {
    return new Promise((resolve, reject) => {
        function next(v) { // 异步迭代写一个迭代函数递归调用
            let { value, done } = it.next(v);
            if (!done) {
                Promise.resolve(value).then(data => {
                    next(data)
                }, reject)
            } else {
                resolve(value); // 迭代完毕
            }
        }
        next();
    })
}
co(read()).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err)
})


// let it = read(); // 获取到了迭代器
// let { value, done } = it.next();
// if (!done) {
//     Promise.resolve(value).then((data) => {
//         let { value, done } = it.next(data);
//         if(!done){
//             Promise.resolve(value).then((data) => {
//                 let { value, done } = it.next(data);
//                 console.log(value,done)
//             })
//         }
//     })
// }

