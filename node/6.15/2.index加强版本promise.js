const Promise = require('./2.promise6.16')


let promise = new Promise((resolve,reject)=>{
    //这里面的代码是同步代码直接就执行了
    console.log(123);
  //  throw new Error('抛出错误')
   // reject('失败')
//    setTimeout(()=>{
//     resolve('你好')
//    },1000)
    
resolve('你好')
})

promise.then(()=>{
    console.log('====================================');
    console.log(1111);
    console.log('====================================');
})
console.log(3);

//then 如果没有在promise里面用(resolve,reject)改状态也会执行  只是因为没有状态只收集 不触发

// let promise2 = promise.then((value)=>{
    
//     return new Promise((resolve,reject)=>{
//         resolve(new Promise((resolve,reject)=>{
//             setTimeout(() => {
//                 resolve('终极隐蔽')
//             }, 2000);
//         }))
//     })
// },(err)=>{
//     console.log(err+'then');
//     return 1
// })

// promise2.then((value)=>{
//     console.log(value);
//     return '床头'
// })
//.then().then().then((v)=>{console.log(v);})