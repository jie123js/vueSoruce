const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class Promise{
    status = PENDING
    sucCal =[]
    faiCal =[]
    sucVal = undefined
    faiVal = undefined
    constructor(fn){

        const resolve = (data)=>{
            if(this.status==PENDING){
                this.status = FULFILLED
                this.sucVal = data
              
                this.sucCal.forEach((fn)=>fn())
            }
            
        }

        const reject = (err) =>{
            if(this.status==PENDING){
                this.status = REJECTED
                this.faiVal = err
                console.log(err);
                this.faiVal.forEach((fn)=>fn())
            }
        }

        //因为如果在promise里面代码执行错误或者抛出异常也要捕获,所以这里用try,catch
        try {
            fn(resolve,reject)
            
        } catch (error) {
            reject(error)
        }


    }

    then(ful,fail){
        if(this.status===FULFILLED){
            ful(this.sucVal)
        }
        if(this.status===REJECTED){
            fail(this.faiVal)
        }
        if(this.status===PENDING){
            this.sucCal.push(()=>{
                ful(this.sucVal)
            })
            this.faiCal.push(()=>{
                fail(this.faiVal)
            })
        }

    }




}

module.exports = Promise