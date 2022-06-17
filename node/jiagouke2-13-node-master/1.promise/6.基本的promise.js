// promise代表的是承诺的意思  promise最核心的就是有三个状态 1）等待态  2） 成功态  3) 失败态
// 状态只能从等待态改变成其他状态 ， 不能从成功变成失败，也不能从失败变成成功

// pending, fulfilled, or rejected.

// 1) 默认你传入的executor会立刻执行, 这个executor函数接受两个参数 resolve，reject 都是函数类型

const Promise = require('./myPromise/promise-1')
let promise = new Promise((resolve,reject)=>{ // pending状态
    // resolve 和 reject可以改变promise的状态，调用then的时候会检测状态来触发对应的函数
    // 在代码中发生异常也是会走失败的情况
    // throw new Error('error')
    // resolve('s');
    // reject('error');
    setTimeout(()=>{ // 异步的情况可以利用发布订阅来解决
        reject('s');
    },500)
});
promise.then((value)=>{ //  成功的回调
    console.log('success',value)
},(reason)=>{ // 失败的回调
    console.log('fail',reason)
})
promise.then((value)=>{ //  成功的回调
    console.log('success',value)
},(reason)=>{ // 失败的回调
    console.log('fail',reason)
})

promise.then((value)=>{ //  成功的回调
    console.log('success',value)
},(reason)=>{ // 失败的回调
    console.log('fail',reason)
})


