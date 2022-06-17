// 1.默认三个状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
function resolvePromise(promise2, x, resolve, reject) {
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
// 原生不支持此方法
Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd
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