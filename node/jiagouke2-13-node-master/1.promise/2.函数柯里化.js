
// 判断数据类型
// typeof 可以判断基础类型 typeof null == ’object‘  （缺陷就是只能判断基础类型）
// Object.prototype.toString.call 比较严格（知道数据的类型，无法细分谁是谁的实例）
// instanceof xxx 是 Xxx实例
// constructor 做类似于找到对应实例的构造函数

// 通过高阶函数来实现参数的保留

function isType(typing,val){
    return Object.prototype.toString.call(val) === `[object ${typing}]`
}
// 每次执行都需要传入字符串, 可以利用高阶函数来实现参数的保留。 闭包的机制（执行上下文不会被销毁）

function isType(typing){
    // typing
    return function(val){ // isString/ isNumber
        return Object.prototype.toString.call(val) === `[object ${typing}]`
    }
}
let util = {}
;['String','Number','Boolean'].forEach(typing=>{
    util['is'+typing] = isType(typing)
})

// let isString = isType('String'); // 缩小了函数的范围
// let isNumber = isType('Number');
console.log(util.isString('abc'))
console.log(util.isNumber(123));

// 闭包：函数定义的作用域和执行的作用域不一致就会发生闭包。


// 函数柯理化、偏函数(有的人统称偏函数也叫柯里化函数) 将多个参数传入的形式转化成n个函数，并且每次传递的参数"是一个"
let r = sum(1,2,3,4,5,6,7);
let r = sum(1,2)(3)(4,5,6)(7); // 缩小了函数的范围
//  作业：是自己实现一个通用的函数柯里化   
// let newType = currying(isType)  
// let isString = newType('String')

// let newSum = currying(sum);
// sum(1,2,3)(4,5)(6,7)

// 反柯里化 放大函数的范围   
// Object.prototype.toString.call(val) -> toString()
// 高阶函数的两种功能，1) 可以扩展功能, 2) 预制参数


// 柯里化函数要求参数是固定
