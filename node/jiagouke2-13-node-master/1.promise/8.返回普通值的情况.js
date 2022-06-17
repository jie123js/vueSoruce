const fs = require('fs');
const path = require('path');

// function readFile(...args){
//     return new Promise((resolve,reject)=>{
//         fs.readFile(...args,function(err,data){
//             if(err) return reject(err);
//             resolve(data);
//         })
//     })
// }
const Promise1 = require('./myPromise/promise-2')
let promise2 = new Promise1((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
    return 
},()=>{
    return x
})

// 1） 我们newPromise 直接resolve了 ，会将resolve的参数传递到了下一次then中
// 2) then中传递的成功和失败的回调的返回值, 我们叫他x
// 用x的类型来决定promise2 走成功还是失败promise2.resolve  promise2.reject
// 3) 如果出错直接调用promise2的reject

promise2.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('fail',err)
})
