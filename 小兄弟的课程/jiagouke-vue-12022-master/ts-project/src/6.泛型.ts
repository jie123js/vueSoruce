class Cat { }
class Dog { }
class Person { }
// typeof Cat | typeof Dog
interface IClazz<T> {
    new(...args: any[]): T
}
function getInstance<T>(Clazz: IClazz<T>) {
    // function getInstance(Clazz: { new(...args: any[]): Cat | Dog }) {
    return new Clazz
}
let r = getInstance(Dog); // 传递猫 我希望返回猫

// ts采用的是 鸭子类型检测， 长得一样就行

// 1) 构造函数怎么表示类型  泛型就是在使用的时候确定类型


// 创建一个数组 5， ’abc‘ -> ['abc',....]
// interface ICreateArray {
//     <T>(times: number, val: T): T[]
// }
type ICreateArray = <T>(times: number, val: T) => T[]
const createArray: ICreateArray = <T>(times: number, val: T) => {
    let arr = [];
    for (let i = 0; i < times; i++) {
        arr.push(val)
    }
    return arr;
}
let r1 = createArray(5, 'abc')


// 循环数组 
// type ICallback<T> = (item: T, index: number) => void
interface ICallback<T> {
    (item: T, index: number): void
}
type IForEach = <T>(arr: T[], callback: ICallback<T>) => void
const forEach: IForEach = (arr, callback) => {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i], i); // ts 类型检测 此时不会执行代码
    }
}
// <T>(arr: T[], callback: ICallback<T>) => {
//     for (let i = 0; i < arr.length; i++) {
//         callback(arr[i], i); // ts 类型检测 此时不会执行代码
//     }
// }
forEach([1, '2', 3], function (item) { }) // item : number | string

// 泛型可以定义多个  元组的交换

function swap(tuple: [number, string]): [string, number] {
    return [tuple[1], tuple[0]]
}
let n = swap([0, 'abc'])

// 泛型就是在用的时候决定类型， 而且泛型可以声明多个

// 泛型约束
// function sum(a: string, b: string): string
// function sum(a: number, b: number): number
function sum<T extends string>(a: T, b: T) { // 应该用重载来写, 这里如果用泛型，无法认为T + T = T
    return a + b; // 如果用泛型做运行返回值是无法推到的，需要采用重载来解决
}
let r3 = sum<string>('1', '2')


// 用于约束这个函数参数应该满足某个类型，这样可以起到约束的作用
// function getPerson<T extends K, K>(obj: T, v: K) { }
// getPerson({ a: 1, b: 2, c: 3 })

// keyof 语法
type IKeys = keyof any // 取key   string | number | symbol  Object.keys()

type IgetVFromK = <T extends object, K extends keyof T>(obj: T, key: K) => T[K]
const getVfromK: IgetVFromK = (obj, key) => {
    return obj[key];
}

let r6 = getVfromK({ a: 1 }, 'a'); // 约束K和T之间的关系

// extends keyof typeof 



// 1) 等号左边根据等号右边来进行推导 (赋值能推导)
// 2) 如果标识了泛型的位置，那么会根据使用时的参数进行推导
export default {}