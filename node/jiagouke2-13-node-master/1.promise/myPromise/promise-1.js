// 1.默认三个状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
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
                this.onResolvedCallbacks.forEach(fn=>fn());
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn=>fn());
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
        if(this.status ===FULFILLED ){
            onFulfilled(this.value);
        }
        if(this.status === REJECTED){
            onRejected(this.reason)
        }
        if(this.status === PENDING){
            this.onResolvedCallbacks.push(()=>{
                // 放自己的逻辑....
                onFulfilled(this.value);
            });
            this.onRejectedCallbacks.push(()=>{
                onRejected(this.reason);
            })
        }
    }
    // 异步一定是在同步之后执行的
    // 同步代码是按照顺序执行
}

// 链式调用的实现 下午是2点
module.exports = Promise;