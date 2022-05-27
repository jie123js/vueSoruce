const queue = []
let isFlushing = false
let resolvePromise = Promise.resolve()

export const queueJob=(job)=>{
    if(!queue.includes(job)){
        queue.push(job)
        
    }
    if(!isFlushing){
        isFlushing=true
        resolvePromise.then(()=>{
            isFlushing=false
            let copy = queue.slice(0) //拷贝一份 防止边更新边修改
            queue.length = 0 //防止下面执行函数时候又添加了queue, 如果放下面的话 新添加的queue会被清空
            copy.forEach((job)=>{
                job.call(job)
            })
            copy.length = 0
           
        })
    }
}