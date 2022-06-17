

const Promise = require('./myPromise/promise-3')
new Promise((resolve,reject)=>{
    resolve('ok');
}).then(null,function(reason){
    throw reason
}).then(null).then(null).then(data=>{
    console.log(data)
},err=>{
    console.log('err',err)
})


// 静态方法