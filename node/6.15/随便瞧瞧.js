

// resolvePromise(x,promise2,resolve,reject){
//     if((typeof x ==='object'&&x!==null)||(typeof x ==='function')){
//         x.then(()=>{

//         })
//     }

// }




// then(onFul,onRej){
//     onFul = typeof onFul ==='function'?onFul:(v)=>{return v}
//     onRej = typeof onFul ==='function'?onRej:(err)=>{throw err }

//     let promise2 = new Promise((resolve,reject)=>{

//         if(this.status===FULFILLED){
//             setTimeout(() => {
//                 try {
//                     let x = onFul(this.sucVal)
//                     resolvePromise(x,promise2,resolve,reject)
//                 } catch (error) {
                    
//                 }
             
//             }, 200);
          
//         }




//     })



//     return promise2
// }

let b =()=>{
    console.log(111);
}
let a = ()=>{
    console.log(123);
    setTimeout(() => {
        console.log(321);
    }, 1000);
    return b
}


a()()

console.log(33333333);