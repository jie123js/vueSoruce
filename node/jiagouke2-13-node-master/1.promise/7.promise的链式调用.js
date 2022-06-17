const fs = require('fs');
const path = require('path');

// 上一个输出的结果，是下一个的输入，回调套回调
// 1） 回调地狱的问题 ， 恶魔金子塔
// 解决方案采用promise 将逻辑改变成链式调用 先将异步api转化成promise的写法


function readFile(...args){
    return new Promise((resolve,reject)=>{
        fs.readFile(...args,function(err,data){
            if(err) return reject(err);
            resolve(data);
        })
    })
}
// fs.readFile(path.resolve(__dirname,'name.txt'),'utf8',function(err,data){
//     if(err) return console.log(err);
//     fs.readFile(path.resolve(__dirname,data),'utf8',function(err,data){
//         if(err) return console.log(err);
//         console.log(data)
//     })
// })
// promise中的then方法需要传递两个函数 （成功和失败的回调）， 这两个方法中是具备返回值
// 1) 返回的是promise的形式, 外层的下一次then会用这个promise是成功还是失败来决定走的是成功还是失败
// 2) 返回的是一个普通值的情况 （不是promise） 就会执行下一次的成功 (会将返回的值向下传递)
// 3) 如果抛出异常会执行下一次的then的失败

// 一。什么情况会走到下一次的失败 返回一个失败的promise或者抛错
// 二。如果返回的是成功的promise或者是一个普通的值会走成功
//todo 如果在失败里面返回普通值也会走成功(就是看的是返回值,不是看第一次走成功还是失败)
readFile(path.resolve(__dirname,'name.txt'),'utf8').then(data=>{
    throw new Error();
},()=>{
    return 123
}).then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('fail',err)
})

// > 总结就是返回值决定下一次then走成功还是失败
// promise是如何实现链式调用的： 像jq实现链式调用靠的是return this,promise有三个状态
// promise实现链式调用返回了一个全新的promise，不能返回this，因为同一个实例不能从成功变为失败