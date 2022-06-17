const Promise = require('./myPromise/promise-3')
const promise2 = new Promise((resolve,reject)=>{
    resolve('ok');
}).then(data=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve('123213213')
                },1000)
            }))
        },1000)
    })
})


promise2.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('fail',err);
})

// [TypeError: Chaining cycle detected for promise #<Promise>]

// If retrieving the property x.then results in a thrown exception e
// let promise = {}
// let times = 0
// Object.defineProperty(promise,'then',{
//     get(){
//         成功
//         if(++times === 2){
//             throw new Error();
//         }
//     }
// })
// promise.then
// promise.then

