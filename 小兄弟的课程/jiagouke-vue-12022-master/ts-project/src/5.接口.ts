// 接口的概念是什么？  基本概念就是用来描述数据的形状的 （对象、类、函数）
// 接口中东西都是抽象的 没有具体实现 

// 可以用type来定义: 这里总结一下 type和interface的区别  都能产生类型 
// 1) type 可以使用联合类型 , interface 不能使用
// 2) type 不能被继承和实现 。 interface可以被继承、实现、扩展
// 3) interface中不能用in 操作符 ， type是可以的   条件、 循环
// 4) type  不能重复定义 和 interface重复定义可以合并

// 赋值操作具备兼容性的特点： 从安全的角度上来进行考量. ...

interface IFruit {
    color: string,
    size: number,
    drink: () => string
}

let f = {
    color: '红色',
    size: 10,
    drink() { return '酸的' },
    taste: '甜的'
}
// let fruit: IFruit = f; // 1) 通过兼容性赋值没有声明的属性

let fruit: IFruit = {
    color: '红色',
    size: 10,
    drink() { return '酸的' },
    taste: '甜的'
} as IFruit; // 2) 

// 3） 接口可以添加可选属性


interface IVeg {
    readonly color: string,
    size: number,
    drink: () => string,
    // taste?: string // 可选的属性，可以添加可以不填
}
// interface IVeg { // 通过同名接口可以合并的特性来实现属性的扩展 ， 一般在写声明文件的时候 希望扩展的时候可以这样搞
//     taste?: string
// }

interface MyVeg extends IVeg, IVeg, IVeg, IVeg { // 要求此接口继承于某个接口 在进行扩展
    // taste?: string
    [key: string]: any // 任意类型
}

let veg: MyVeg = {
    color: '红色',
    size: 10,
    drink() { return '酸的' },
    taste: '甜的'
}

let veg1: MyVeg = {
    color: '红色',
    size: 10,
    drink() { return '酸的' },
    a: 1,
    [Symbol()]: 1,
    1: 200
}

// 1) 借助赋值兼容性问题  2） 断言的方式  3） 加?号的方式   4） extends扩展的方式

// ts 中庸接口 描述其他的类型    [key: string]: any  可索引类型

interface IArr {
    [key: number]: any
}
let arr: IArr = { 1: 'string', 2: 300 } // 这里也是一样 我们可以通过可索引接口定义数组 和 数字映射表


// 能使用type 就用type， 不能用type的时候 考虑interface


// interface ISum { // 可以描述函数的属性
//     (x: string, y: string): string
// }
// const sum: ISum = fn;
interface ICounter { // 混合接口 可以描述 函数 + 属性
    (): number;
    count: number;
}
const fn: ICounter = function counter() {
    return counter.count++;
}
fn.count = 0;

// 用接口来描述类
interface IEat {
    eat(): void
    // eat: () => void  // 在ts 类中 描述实例方法和原型方法  this.xx = function()
}
interface IDrink {
    drink(): void
}
class Dog implements IEat, IDrink { // ts中识别不了是类上的还是实例上的
    eat!: () => void
    constructor() {

    }
    drink(): void {
        throw new Error("Method not implemented.");
    }
}

class Cat {
    play() { }
}
// 类还可以被接口继承
interface IPerson extends Dog, Cat { // 类 类型

}
let person: IPerson = {
    eat() { },
    drink() { },
    play() { }
}


// ------------------ 接口可以描述类 （都是抽象的描述）      “抽象”类 (不能被new )

abstract class Animal { // 可以在父类中定义抽象方法，子类必须要实现
    abstract eat: () => void // 要求子类实现的
    drink() { // 提供的真实存在的方法
        return '喝水'
    }
}
class Tom extends Animal {
    eat!: () => void;
    // eat: () => void
    // constructor() {
    //     super()
    //     this.eat = function () { }
    // }
    // eat() {

    // }
}
//  接口也可以描述类的构造函数和实例,  下午讲泛型 
//  内置的类型  其他概念





export { }



// interface propType {
//     [key: string]: any
// }

// // let props: propType

// type dataType = {
//     title: string
// }
// interface dataType1 {
//     title: string,
// }
// const data: dataType = { title: "订单页面" }
// const data1: dataType1 = { title: "订单页面", a: 1 }
// let props: propType = data1


