const Promise = require('./1.promise基础款6.15')


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


//then 如果没有在promise里面用(resolve,reject)改状态也会执行  只是因为没有状态只收集 不除非

let promise2 = promise.then((value)=>{
    console.log(value);
    return value+'then'
},(err)=>{
    console.log(err+'then');
})

console.log(321);