// 1.默认三个状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
// 判断x 和 promise2的关系，决定走成功还是失败
function resolvePromise(promise2,x,resolve,reject){
    // 如果x 是一个普通值则调用resolve就可以了
    // 如果x 是一个promise要看他是一个成功的promise还是失败的


    // 此方法解决了不同的promise库之间的调用





}
class Promise {
    constructor(executor) { // 2.用户传入一个executor
        this.status = PENDING;
        // 这里可以用一个变量，为了看的清除 用2来表示
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = []; // 存放成功的回调的
        this.onRejectedCallbacks = []; // 存放失败的回调的
        const resolve = (value) => {
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
        // 执行成功和失败的逻辑
        // 不停的创建新的promise，来实现链式调用
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    // 放自己的逻辑....
                    setTimeout(()=>{
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2,x,resolve,reject)
                        } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                            reject(e);
                        }
                    },0)
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(()=>{
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2,x,resolve,reject)
                        } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                            reject(e);
                        }
                    },0)
                })
            }
        });

        return promise2
    }
    // 异步一定是在同步之后执行的
    // 同步代码是按照顺序执行
}

// 链式调用的实现 下午是2点
module.exports = Promise;