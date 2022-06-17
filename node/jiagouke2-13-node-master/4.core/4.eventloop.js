
// process.nextTick(()=>{  // node中新增的微任务 
//     console.log('nextTick')
// })

// console.log('abc')


// Promise.resolve().then(()=>{
//     console.log('promise')
// })

setImmediate(()=>{ // node中新增的宏任务
    console.log('setImmediate')
})

setTimeout(()=>{
    console.log('setTimeout')
})

// 这些方法 nextTick/setImmediate 开发中用的不对， 面试的时候会考察node中的事件环

// 同步代码先执行 （执行的过程中会产生异步逻辑） 
// 同步代码执行完毕后会立刻执行process.nextTick (node官网描述这玩意不属于事件环的一部分)
// 在浏览器中宏任务队列全局只有一个，但是node中将宏任务也进行了分类 （node中是自己实现的事件环libuv）


// 我们关心的node中的事件环有三个队列 timers、poll、check
// 代码走到poll阶段会检测check队列中是否有回调，如果没有就在poll队列中等待，检测是否有新的i/o进来，或者定时器是否达到时间
// 如果check中有队列，则向下执行， 在回到poll中


// v8引擎是负责解析js语法的，而且可以调用node中的api
// libvu 是需要负责执行node中的api， 执行过程还是多线程的，执行完毕后会放到队列中， 会开启一个单独的事件线程来处理任务
// libuv 决定调用的任务是同步还是异步

// 微任务： 微任务在每次宏任务执行完毕一个后就会清空微任务

// node中的eventloop和浏览器中执行的结果是一致的，每次执行一个宏任务就会清空微任务队列。 早期版本10以前的版本会有差异。 
// 早期一个队列清空完毕才会清空微任务，node为了实现和浏览器一致所以改成了，执行一个宏任务就清空队列

// i/o setImmediate
// 如果在主栈中调用了 timer 和 setImmediate执行顺序会受性能影响，有可能进入到事件循环的时候定时器没有到时间，则直接进入到check中了


const fs = require('fs');

fs.readFile('./work.md', () => { // 轮训阶段完成的
  setTimeout(() => { // setTimeout 
    console.log('timeout');
  }, 0);
  setImmediate(() => { // setImmediate 优先级一定高于setTimeout
    console.log('immediate');
  });
});

// 注意执行的顺序，其他的都是一样的。