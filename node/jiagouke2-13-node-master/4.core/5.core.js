// 文件模块， 自己写的模块。 查找问题 
// 文件模块查找机制 , 可能引用的是一个文件夹 

const path = require('path')
const r = require(path.resolve(__dirname,'4.eventloop.js')); // 去尝试添加 js 和 .json后缀  每个版本有点差异， 先找文件，在查找文件夹，老版本的话如果文件夹中有package.json
// 如果文件不存在则会查找文件夹中的index.js, 如果有package.json则以package.json 为准。 不会默认查找index了


// 代码不要有歧义
// 文件模块有2中，可以用相对路径，也可以用绝对路径， 只要是相对或者绝对路径我们就叫他文件模块，自定义模块

// 核心模块  events  （fs,path,vm,events）  不需要自己写，也不用安装可以直接引用

const EventEmitter = require('events'); // 内置模块检测时候 会进行检测
// 发布订阅： 能解决什么问题？  异步， 解决代码耦合的问题 （组件通信）
const util = require('util')

function Girl(){}
util.inherits(Girl,EventEmitter)

let girl = new Girl(); // once

// 批处理 例如多次修改数据只更新一次页面 

let flag = false;
girl.on('newListener',(type)=>{ // 此方法可以监控到用户绑定了哪些事件
    if(!flag){
        process.nextTick(()=>{
            girl.emit(type); // ?
        })
        flag = true;
    }
})
// 1.绑定事件触发newListener 但是立刻 emit了 ， 喝酒这件事还没放到队列中
girl.on('女生失恋了',()=>{ // {女生失恋了:[fn,fn,fn]}
    console.log('喝酒')
})
// 2.绑定事件触发newListener, 触发emit, 只有喝酒这在队列中
girl.on('女生失恋了',()=>{
    console.log('逛街')
})
// 2.绑定事件触发newListener, 触发emit, 只有喝酒、逛街这在队列中
girl.on('女生失恋了',()=>{
    console.log('哭')
})
// const shopping = ()=>{
//     console.log('逛街')
// }

// girl.once('女生失恋了',()=>{
//     console.log('哭')
// })
// girl.off('女生失恋了',shopping); // 取消绑定的事件
// girl.emit('女生失恋了') // 第一次执行完毕后在列表中移除了哭的这件事
// girl.emit('女生失恋了')

// 让类继承原型方法
// ES6 直接extends 就可以了 
// Girl.prototype.__proto__  = EventEmitter.prototype
// Girl.prototype =  object.create()  
// Object.setProrotypeof()



// 第三方模块 别人写好的模块我们可以安装来用
// 模块分为两种  1） 全局模块 （只能在命令行中使用的模块）  2） 项目依赖的模块

// node中有三个常用的模块 npm (安装包) nrm （切换源） nvm(在windows需要特定的安装win版)
// npm install nrm -g
// C:\Users\test1\AppData\Roaming\npm\nrm -> C:\Users\test1\AppData\Roaming\npm\node_modules\nrm\cli.js
// nrm use 某个源，安装的时候就可以这个源来安装

// 正常来说在path路径下的模块都可以执行， 并没有把全局模块放到path下而是将这个模块放到了npm目录下，npm在path中，所以所有的模
// 块都可以执行

// 如何编写一个全局模块呢？


// npm 



// buffer fs