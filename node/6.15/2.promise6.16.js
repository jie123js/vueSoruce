const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";


function resolvePromise(promise2,x,resolve,reject){

    if(x===promise2){//不能返回和自己一样的promise
        reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]'));
    }
     if((typeof x ==='object'&& x !==null)||(typeof x ==='function')){
       let called = false //防止重复调用  边缘处理 就是有的人的promise可能没写重复改状态的判断
        try {
            let then = x.then //有thne不一定是promise {then:123}
            if(typeof then ==='function'){//{then:function(){} 这种情况也没办法 不过官方不处理}
                
                then.call(x,(y)=>{
                    if(called) return
                    called =true
                    //resolve(y)
                    //这里有可能resolve(new promise) 又是一个promise所以递归一下
                    resolvePromise(promise2,y,resolve,reject)
                },(r)=>{
                    if(called) return
                    called =true
                    reject(r)
                })
    
            }else{
                //{then:'123}
              
                resolve(x)
            }
        } catch (error) {
            if(called) return
            called =true
            reject(error)
        }

    }else{
        resolve(x)
    }




    }




class Promise {
 
  constructor(fn) {
    this.status = PENDING;
    this.sucCal = [];
    this.faiCal = [];
    this.sucVal = undefined;
    this.faiVal = undefined;



    const resolve = (data) => {
      if (this.status == PENDING) {
        this.status = FULFILLED;
        this.sucVal = data;

        this.sucCal.forEach((fn) => fn());
      }
    };

    const reject = (err) => {
      if (this.status == PENDING) {
        this.status = REJECTED;
        this.faiVal = err;
        console.log(err);
        this.faiCal.forEach((fn) => fn());
      }
    };

    //因为如果在promise里面代码执行错误或者抛出异常也要捕获,所以这里用try,catch
    try {
      fn(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    let promise2 = new Promise((resolve, reject) => {
      //这个定时器是为了让里面的函数能拿到promise2
   
      
          if (this.status === FULFILLED) {
            setTimeout(() => {
                try {
                    let x = onFulfilled(this.sucVal);
       
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error);
                }
                
            }, 0);
          
          }
       
    
    
          if (this.status === REJECTED) {
            setTimeout(() => {
                try {
                    let x = onRejected(this.faiVal);
        
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error);
                }
            },0)
        }
              
  
    
          if (this.status === PENDING) {
            this.sucCal.push(() => {
                setTimeout(() => {
                    try {
                        let x =onFulfilled(this.sucVal);
           
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
             
           
           
            });
            this.faiCal.push(() => {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.faiVal);
       
                resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error);
                    }
                    
                }, 0);
            
        
            
            });
          }
      
     
    });

    return promise2;
  }
}



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
module.exports = Promise;
