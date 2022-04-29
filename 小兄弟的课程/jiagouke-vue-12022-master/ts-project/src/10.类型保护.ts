// 1) 写项目
// 2) 能看懂别人写的类型
// 3) 能自己写类型


// 类型保护  ts 本身提供了一些类型识别   , js也提供了一些类型保护

// typeof 
function getVal(val: string | number) {
    if (typeof val === 'string') {
        val
    } else {
        val
    }
}
class Person { }
class Dog { }
function getInstance(val: Person | Dog) {
    if (val instanceof Person) {
        val
    } else {
        val
    }
}
type a = { a: 1, flag: 'a' };
type b = { b: 2, flag: 'b' }

function getV1(val: a | b) {
    if ('a' in val) {
        val
    } else {
        val
    }
}
function getV2(val: a | b) {
    if (val.flag === 'a') {
        val
    } else {
        val
    }
}
// typeof instanceof in  可辨识类型 (只是增加了一个标识而已)


// ts 语法 is语法  (isObject、isFunction、isArray)

function isNotA(val: a | b): val is b { // 来声明自己的类型
    return val.flag !== 'a'
}
function getV3(val: a | b) { // isSameVnode
    if (isNotA(val)) {
        val
    } else {
        val
    }
}












export { }