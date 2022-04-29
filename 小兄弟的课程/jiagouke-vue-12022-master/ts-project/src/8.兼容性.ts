// 类型兼容性   各种的类型的兼容方式不一样，  看是否兼容就看我们的类型赋予的时候是否安全

let base1!: string | number;
let base2!: string | number | boolean;


// base2 能不能赋予给base1这个类型
// base1 = base2; // 在基本类型中范围大的不能赋予给范围小的 

// base2 = base1; // 这要操作是正常的 ，原因就是赋值的属性类型是在范围中


// 对象的赋值问题  a <- b b是否满足a的所有特性，如果满足则可以赋值 

interface IFruit {
    color: string
}
interface IVeg {
    color: string,
    taste: string
}

let fruit: IFruit = { color: 'red' }
let veg: IVeg = { color: 'red', taste: '酸的' }

// 这里我们要思考 被赋值的接口 是否全部满足，如果满足即可赋值, 但是非法属性不能被调用
fruit = veg;  // 结论对于接口而言多的可以赋予少的


// 函数的兼容性  参数的兼容性和返回值的兼容性

// let f1!: (a: string, b: string) => string
// let f2!: (a: string, b: string, c: string) => string;

// forEach((item,index,array)=>{})  实际上用的时候 可以只用一个

// 对于函数的参数而言，定义的参数个数 需要大于等于使用的参数个数


let f1!: (a: string, b: string) => string
let f2!: (a: string, b: string) => string | number;


f2 = f1; // 返回值 和 基本类型是一样的， 返回的类型主要满足范围即可 （返回值 需要返回子类型）


// 类的兼容性  鸭子类型检测

class Person { public type = '善良' }
class Dog { public type = '善良' }

let dog = new Dog;
let person = new Person;
person = dog
dog = person; // 类的兼容性，比较的是实例 （对象） 和接口就一致了， 多的可以赋予给少的

// 如果一旦有了修饰符(private,protected)，那么就不能来回的兼容了
let dog1: { type: string } = dog;


// 函数的参数如果只有一个的情况下是如何兼容的

// 父 -》 子 -》 孙子

class Parent {
    money!: string
}
class Son extends Parent {
    car!: string
}
class GrandSon extends Son {
    play!: string
}
let son = new Son();
let parent = new Parent();
let grandson = new GrandSon();
function fn(callback: (val: Son) => Son) { // 类的类型描述的是实例
    callback(son); // 这里的callback最多给你传递是一个son
}
fn((val: Parent) => new GrandSon)

// 我这个val 要求你得有money， 你给我传递的儿子中 有money和car

// 我这个val 要求你得有money，car,play,你给我传递的儿子中 有money和car  不满足

// 这里的函数参数兼容性，不是把类型多的赋值给少的，而是等会调用的时候 要将接受的类型赋回来

// 参数传父亲 逆变的 
// 函数的参数的方式叫 逆变  可以给父亲
let fn1!: (val: Son) => void;
let fn2!: (val: Parent) => void; // 从调用的角度来考虑
fn1 = fn2
// 返回值可以返回孙子，因为只要比你的多就可以

// 返回值 可以返回儿子， 协变 

// 传父（逆变） 反子(协变)

function fn3(cb: (val: string | number | null) => string | number) {
}
fn3((val: string | number | null | boolean) => 123)

// 传递可以是父亲， 返回值 只要是儿子就可以, ts 有个开关可以实现双向协变  (开启后 参数就是双向协变了)


// 枚举类型不存在兼容性  枚举类型不能兼容   
const enum User1 {
    name = 1
}
const enum Person1 {
    name = 1
}
// let u: User1;
// let p: Person1

// u = p



export { }