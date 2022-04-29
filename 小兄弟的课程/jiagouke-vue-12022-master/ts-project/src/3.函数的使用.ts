// 函数也需要添加类型  1） 给函数本身添加类型  2） 函数的参数添加类型  3） 给函数的返回值添加类型

// 函数声明方式有两种表达式声明方式  const fn = function(){}    函数关键字来声明类型


// 如果在函数里面标识 返回值需要用=> 来标识
// 这里一般我们不需要给函数本身添加类型，因为函数表达式可以自动推导
let fn = (a: string, b: string): string[] => [a, b]
const sum: (x: string, y: string) => string[] = fn; // 这样写就是兼容性： 看fn是否满足sum的类型


// 函数关键字声明的写法是不能给函数本身添加类型的
function sum1() { }
// 只需要考虑函数的参数和返回值 


// 函数的参数依旧支持js的特性 默认值，剩余运算符， （可选参数）

function defaultFn(a = '', ...args: number[]) {

}

function defaultFn1(this: IThis, a = '', b?: string | undefined) { // 如果不传递b ， 那么b是什么类型. 默认可选属性是要+？ 要么会变成必传属性

}
const obj = { name: 'zf' }
type IThis = typeof obj; // 自动提取出类型

defaultFn1.call(obj, 'a')

// 1)  this类型要进行声明  ， 2) 我们不在使用arguments(用的时候就是取length)  3) 可以设置? 来表述属性是否是必传

// 2) ts给我们设计了一个函数的重载  什么叫函数的重载  （参数不同，对应的逻辑就不同  h） 
// ts的函数重载指代的就是类型，和代码没有关系，

function toArray(val: number): number[]
function toArray(val: string): string[]
function toArray(val: number | string) {// 只要实现参数是 父类型就好 
    if (typeof val === 'string') {
        return val.split('')
    } else {
        return val.toString().split('').map(Number)
    }
}
let r2 = toArray(123)
let r1 = toArray('123')

// 一个函数 拥有不能的使用功能，我们就考虑函数的重载
// 'abc' -> ['a'，'b','c']
//  123 -> [1,2,3]

export { };
