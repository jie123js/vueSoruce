const fs = require('fs');
const path = require('path');
const Promise1 = require('./myPromise/promise-3');
// 1) --------------------延迟对象
function readFile(...args) {
    let dfd = Promise1.deferred(); // 创造一个延迟对象， 可以获取到promise和resolve及reject属性
    fs.readFile(...args, function (err, data) {
        if (err) return dfd.reject(err);
        dfd.resolve(data);
    })
    return dfd.promise; // 返回promise实例
    // return new Promise((resolve,reject)=>{
    //     fs.readFile(...args,function(err,data){
    //         if(err) return reject(err);
    //         resolve(data);
    //     })
    // })
}
// readFile(path.resolve(__dirname,'name.txt'),'utf8').then(data=>{
//     console.log(data);
// });
// 2) ---------------------resolve和reject
// resolve 如果放了一个promise的话会有等待效果，等待解析后向下执行
// reject 没有等待效果
// let p = new Promise1((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve('xxxxx')
//     },3000)
// })
// // catch具备统一处理错误的功能
// Promise1.reject(p).then().then().catch( err => {
//     console.log('f', err)
//     return 'abc'
// }).then(data=>{
//     // 这里可以继续then 不受catch影响，catch就是一个then方法
//     console.log(data);
// });

// Promise.resolve  Promise.reject  catch


// 3) 实现Promise.finally
// Promise.prototype.finally = function (finalCallback) {
//     return this.then(
//         value => Promise.resolve(finalCallback()).then(() => value),
//         reason => Promise.resolve(finalCallback()).then(() => { throw reason })
//     )
// }
new Promise((resolve, reject) => {
    //resolve('成功');
    reject('失败'); // 有个逻辑 无论成功和失败都要执行
}).finally(() => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // clearTimeout
            resolve();
            console.log('finally');
        }, 1000)
    })
}).then((v) => {
    console.log('成功', v)
}).catch((r) => {
    console.log('catch', r)
});


// 都成功才算成功有一个失败就失败了  [0,1,2]
Promise.all = function(promises){
    return new Promise((resolve,reject)=>{
        let arr = [];
        let times = 0;
        function processData(key,value){
            arr[key] = value;
            if(promises.length === ++times){
                resolve(arr)
            }
        }
        for(let i = 0; i < promises.length;i++){
           Promise.resolve(promises[i]).then((value)=>{
             processData(i,value);
           },reject)
        }
    })
}
Promise.all([readFile(path.resolve(__dirname,'name.txt'),'utf8'),readFile(path.resolve(__dirname,'age.txt'),'utf8'),13]).then(data=>{
    console.log(data);
}).catch((err)=>{
    console.log(err);
});
// 作业：1）实现柯里化函数 ，反柯里化
// 2）race 赛跑  allSettled 无论成功和失败都执行的方法
// 3）回去将promise写一遍，掌握思想