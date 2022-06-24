//const { reject } = require('./promise方法');
const Promise1 = require('./promise方法')

// Promise1.resolve(100).then((val)=>{
//     console.log(val);
// })
let c = new Promise1((res,rej)=>{
    res(123)
}).then((v)=>console.log(v)

).then((c)=>console.log(c))

let p = new Promise1((resolve,reject)=>{
    setTimeout(() => {
        console.log(111);
        resolve('nih')
    }, 1000);
}).finally(()=>{
    return new Promise1((res,rej)=>{
        setTimeout(() => {
            res()
            console.log(23);
        }, 2000);
    })
})

.then((v)=>{
    console.log(321+v);
}).catch(()=>{
    console.log('错误');
})


// Promise.resolve(p).then((v)=>{
//     console.log('a'+v);
// })




// let a = ()=>{
//     setTimeout(() => {
//         console.log(1);
//     }, 22);
// }
// let b = ()=>{
//     console.log('b');
// }

// let c = [a,b]
// c.forEach(fn => {
//     fn()
// });