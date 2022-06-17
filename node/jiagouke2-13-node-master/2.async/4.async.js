const fs = require('fs').promises; // 这里拿到的所有fs都是promise方法fs.readFile
const path = require('path');


// async + await = generator + co 来实现的
async function read() { // 预期这样实现
    let fileName = await fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');
    let content = await fs.readFile(path.resolve(__dirname, fileName), 'utf8');
    return content;
}
// function co(it) {
//     return new Promise((resolve, reject) => {
//         function next(v) { // 异步迭代写一个迭代函数递归调用
//             let { value, done } = it.next(v);
//             if (!done) {
//                 Promise.resolve(value).then(data => {
//                     next(data)
//                 }, reject)
//             } else {
//                 resolve(value); // 迭代完毕
//             }
//         }
//         next();
//     })
// }
// async函数默认执行后就会返回一个promise，内部是支持tryCatch
read().then(data => {
    console.log(data);
}).catch(err => {
    console.log('c', err)
})
