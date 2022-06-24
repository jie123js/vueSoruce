// 1.默认三个状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
function resolvePromise1(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]'));
    }
    // 如何判断一个值是不是promise?  有没有then方法，有then方法的前提得是 x是一个对象或者函数
    if ((typeof x === 'object' && x !== null) || (typeof x === 'function')) {
        let called = false;
        try {
            let then = x.then; // 有then就是promise吗？ {then:123}
            if (typeof then === 'function') { // {then:function(){}}
                //  如果有一个then方法那么就说他是promise
                // 这里就是promise 要判断是成功的promise还是失败的promise
                // 这里直接用上次取出的then来继续使用，防止再次取then发生异常
                then.call(x, y => {
                    if (called) return
                    called = true;
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {
                    if (called) return;
                    called = true;
                    reject(r);
                }); // x.then(成功的回调，失败的回调)
            } else {
                // {}  {then:'123'}
                resolve(x); // 这里直接成功即可 普通值的情况
            }
        } catch (e) {
            if (called) return
            called = true;
            reject(e); // 直接失败即可
        }
    } else {
        resolve(x); // 这里直接成功即可 普通值的情况
    }
}
class Promise {
    constructor(executor) {
        this.status = PENDING;
        // 这里可以用一个变量，为了看的清除 用2来表示
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = []; // 存放成功的回调的
        this.onRejectedCallbacks = []; // 存放失败的回调的
        const resolve = (value) => {
            // 这里我们添加一个规范外的逻辑 让value值是promise的话可以进行一个解析
            if(value instanceof Promise){
                // 递归解析值
                return value.then(resolve,reject)
            }
            if (this.status === PENDING) {
                this.status = FULFILLED
                this.value = value;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject); // 3.这个代码执行的时候可能会发生异常
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) { // 4.调用then的时候来判断成功还是失败
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    // 放自己的逻辑....
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                            reject(e);
                        }
                    }, 0)
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                            reject(e);
                        }
                    }, 0)
                })
            }
        });

        return promise2
    }

    catch(errorCallback){
        return this.then(null,errorCallback)
    }
}

// npm install promises-aplus-tests -g 全局安装只能在命令行中使用
// promises-aplus-tests promise-3.js

Promise.reject = function(reason){
    return new Promise((resolve,reject)=>{
        reject(reason)
    })
}
Promise.resolve = function(value){
    return new Promise((resolve,reject)=>{
        resolve(value)
    })
}
module.exports = Promise;


const resolvePromise = (Promise2,x,resolve,reject)=>{
    if(Promise2===x){
        reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]'))
    }
    //判断是不是promise
    if((typeof x==='object'&&typeof x!==null)&&(typeof x ==='function')){
        //进入这个循环说明返回值已经是一个promise了  现在看看有没有then要判断这个xpromise的状态是成功还是失败
        try {
            let then = x.then
            if(typeof then ==='function'){
                then.call(x,(y)=>{
                    resolve(y)
                },(error)=>{
                    reject(error)
                })


            }else{
                resolve(x)
            }
            
        } catch (error) {
            reject(error)
        }

    }else{
        resolve(x)
    }
}

class MyPromise{

    constructor(fn){
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
        this.onResolvedCallbacks=[]
        this.onRejectedCallbacks=[]

        const resolve =(value)=>{
            if(value instanceof Promise){
                return value.then(resolve,reject)
            }
            if(this.status===PENDING){
                this.status=FULFILLED
                this.value =value
                this.onResolvedCallbacks.forEach((fn)=>fn())
            }
        }

        const reject =(value)=>{
            if(this.status===PENDING){
                this.status=REJECTED
                this.reason =reason
                this.onRejectedCallbacks.forEach((fn)=>fn())
            }
        }

        try {
            fn(resolve,reject)
            
        } catch (e) {
            reject(e)
        }
    }

    then(onFulfilled,onRejected){
        onFulfilled = typeof onFulfilled==='function'?onFulfilled:v=>v;
        onRejected = typeof onRejected ==='function'?onRejected:(reason)=>{ throw reason};

// promise中的then方法需要传递两个函数 （成功和失败的回调）， 这两个方法中是具备返回值
// 1) 返回的是promise的形式, 外层的下一次then会用这个promise是成功还是失败来决定走的是成功还是失败
// 2) 返回的是一个普通值的情况 （不是promise） 就会执行下一次的成功 (会将返回的值向下传递)
// 3) 如果抛出异常会执行下一次的then的失败

// 一。什么情况会走到下一次的失败 返回一个失败的promise或者抛错
// 二。如果返回的是成功的promise或者是一个普通的值会走成功
//todo 如果在失败里面返回普通值也会走成功(就是看的是返回值,不是看第一次走成功还是失败)

        let Promise2 = new Promise((resolve,reject)=>{

            if(this.status===FULFILLED){
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(Promise2,x,resolve,reject)
                        
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }


            if(this.status===PENDING){
                setTimeout(() => {
                    this.onResolvedCallbacks.push(()=>{
                        let x = onFulfilled(this.value)
                        resolvePromise()
                    })

                }, 0);
            }

        })

        return Promise2

    }


}