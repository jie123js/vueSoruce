
// 浏览器中的全局对象是window
// 在服务端中全局对象是global, 全局对象中的属性可以直接访问， js中内置的方法依然可以使用

// console.dir(global,{showHidden:true}); // 以前的js中方法都能使用

// console.log(this); // 默认是一个空对象， 模块化的问题


// 模块化机制来实现不同文件之间的引用
// 前端如何实现模块化呢？ (1.命名冲突问题， 传统利用单例来实现模块的封装会有调用过长的问题) 
// iife立即执行函数 , 需要将内容导出去 利用了闭包。 需要在拆分文件

// > 我们希望解决命名冲突，而且用的时候不会导致模块间相互影响 

// seajs requirejs (没人用了)  -> import export default  前端的模块 还是基于http请求
// 服务端实现模块化不需要发请求，可以用于读写文件的能力了。

// 模块化的概念 规定了如何使用别人的内容，如何将内容导出给别人使用
// commonjs 规范  1） 每一个文件都是一个模块  2） 我如果想用别人就require  3） 想让别人用就modules.exports导出

// 如果引入了一个文件，会读取文件, 给这个js文件包一个函数，并且默认导出module.exports 这样就可以拿到结果了


// 休息3分钟 来实现以下这个require
// 基本的模块的使用


// node中的模块有三种格式 
// 1） 内置模块 fs   
// 2) 第三方模块 co 安装后再使用，用法和核心、内置模块一致
// 3) 文件模块 自己写的文件， 需要通过相对路径或者绝对路径来进行引用

// node中全局对象是global对象，global上的属性都可以直接访问

// require引用文件  module就是当前模块， exports就是一个对象 __dirname 当前文件所在的绝对路径  __filename文件的绝对路径
// console.log(require,exports,__dirname,__filename)

// 默认执行文件，会包裹一个函数
// console.log(arguments) // exports,require,Module __filename, __dirname 这些也可以叫全局对象

const fs = require('fs'); // fs.readFile
const { Module } = require('module');
const path = require('path'); // 处理路径的
// fs 中有两种api 一种同步一种异步
let r1 = fs.readFileSync(path.resolve(__dirname, 'note.md'), 'utf-8'); // 什么时候用同步，什么时候用异步
// 如果当前客户请求的时候，如果用同步会有阻塞问题
// 如果代码刚启动的时候，用同步没有任何影响

let r2 = fs.existsSync(path.resolve(__dirname, 'note1.md')); // 此方法异步的方法被废弃了 因为异步方法没有error所以不需要了
console.log(r2)


console.log(path.resolve('note.md', 'a', 'b', '../')); // 这个方法标识根据路径解析出一个绝对路径 （解析的路径是以运行为基准） 具备拼接功能的
console.log(path.join('note.md', 'a', 'b', '../')); // 只是负责路径的拼接没有其他任何的功能

// 用的时候 可以用resolve，也可以用join, 如果有/拼接的情况不要使用resolve， 其他情况下可用哪个都行
console.log(path.join(__dirname, 'note.md'));
console.log(path.resolve(__dirname, 'note.md'));
console.log(path.basename('a.js', '.js')); // a.js - .js
console.log(path.extname('a.min.js')); // .js
console.log(path.dirname(path.resolve(__dirname, 'note.md'))); // __dirname


const vm = require('vm'); // node中的虚拟模块， 可以创建代码的执行环境

// 如何让字符串执行呢？  eval()  /  new Function
let a = 100;
// eval('console.log(a)'); // eval执行的时候会取当前作用域下的变量

// new Function(){} 在node中执行js可以使用newFunction 

// let fn  = new Function('console.log(a)')
// fn()

// vm.runInThisContext('console.log(a)'); // 内部模块实现拿到字符串后会通过runInThisContext来执行代码 ， 只在模块化中用到


// fs,path,vm  1) 命令行，没人用  1) 在浏览器中调试  
const b = require('./a') // 查看require执行流程， 调试.
require('./a');
require('./a');
console.log(b);

// node --inspect-brk 1.js   可以在浏览器中调试


// 在编辑中可以直接调试

// 分析require的实现方法

// 1.Module.prototype.require 实际上require就是这样一个方法
// 2.Module._load 加载某个模块 返回load的执行结果 , 应该返回的是module.exports, 需要将导出的结果放到module.exports上
// 3.Module._resolveFilename这个方法可以获取文件的绝对路径， 因为稍后要读取这个文件。 会尝试添加 .js .json
// 4.去查找缓存中是否有值， 有值就是加载过了
// 5.看一下模块是不是原生的模块
// 6.如果不是原生模块 直接创建模块 new Module() id模块的路径,exports代表的是文件的导出结果默认是空对象
// 7.将刚才创建的模块缓存起来，为了下次使用的时候可以使用缓存

// > 创建一个模块 模块上有一个exports={}属性， 最终返回的是module.exports

// module.load
// 根据文件名的后缀来进行加载， 会根据不同策略来加载  Module._extenstions[后缀] = 加载方法就可以扩展了
// 读取文件的内容 fs.readFileSync(filename, 'utf8');
// module._compile 进行模块的编译
// wrapSafe 给读取到的内容包裹一个函数  ， vm.compileFunction这个方法可以包装一个函数
// __dirname = path.dirname(文件名)
// require 用的就是一个方法
// exports 就是module.exports = {}
// this = module.exports = {}
// module = 就死当前模块
// 让函数执行，执行的时候用户会手动将导出的结果放到module.exports上   module.exports = 'hello'
// 最终返回的是module.exports 所以可以拿到require的对应的结果

// 下节课我们会模拟实现一个