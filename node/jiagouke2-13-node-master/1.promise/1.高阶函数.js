// 掌握高阶函数的概念 什么样的函数可以称之为高阶函数 1) 一个函数返回一个函数则称之为高阶函数
// 2) 一个函数他的参数是一个函数，那么这个函数也是高阶函数  
// 满足任何一个特性都是高阶函数
// function fn(){
//     return function(){}
// }

// function fn(cb){}
// fn(function(){})

// 扩展方法 我们可以在基于原来的代码进行一系列扩展
function core(...args) {
    // ....
    console.log('core xxx', args)
}
Function.prototype.before = function (cb) {
    // 在函数参数中叫剩余运算符
    return (...args) => { // newCore 箭头函数中没有this，this会向上查找
        cb();
        this(...args); // 在执行的时候叫展开运算符
    }
}

let newCore = before(function () {
    console.log('before core')
})
newCore('my');