// 学习ts的原则  基础类型
// ts中有很多类型 （内置的类型 dom、promise... 都在typescript模块中的， 基础类型， 可以自定义一些类型了， 高级类型）
// ts 中的类型都在变量后面 ：后面的都是类型 =后面的是值
// ts 类型要考虑安全性，一切从安全角度上触发,
// ts 在使用的时候程序还没有运行

// 什么时候要写类型 ， 什么时候不需要写类型  (ts中有类型推导， 会自动根据赋予的值来返回类型, 只有无法推到或者把某个值赋予给某个变量的时候我们需要添加类型)
// 用ts开发好处是提示多，缺点就是要额外的编写类型

// 尽可能避免写any. 如果写了any 就表示不检测了， 有的时候还是得写any

// 我们使用ts的时候 肯定是要采用模块化的

// 基础类型：  string number boolean  (什么基础类型 什么叫包装类型)

let str: string = "abc";
let num: number = 123;
let bool: boolean = true;

// 我们标识类型的时候 基本类型全部用小写的，如果描述实例则用类的类型 （类可以描述实例 ： 类类型）
// let s1: string = "abc";
// let s2: String = "abc";
// let s3: string = new String("abc");
// let s4: String = new String("abc");
// let s5: String = "abc";  / new String("abc"); 都可以

// class Dog {}
// let dog: Dog = new Dog();

// 4.ts 中还有数组类型  什么叫数组？  数组真实的概念是存储一类类型的东西

let arr1: number[] = [1, 2, 3, 4, 5];
let arr2: (number | string)[] = ["a", 1, 2, 3]; // 联合类型

let arr3: Array<number | string> = ["a", 1, 2, 3]; // 后面讲泛型的时候 在来说为啥可以这样写

// 5.元组类型  元组的特点就 固定长度 固定类型的一个数组
let tuple: [number, string] = [1, "a"]; // 取值的时候只能通过 已经有的属性取值
// tuple.push(1); // 但是不能通过不安全的手段来取值

// 我要求我媳妇有车有房 （底线） 主要满足就可以  ， 我媳妇还有钱 。 这个钱不能花。  不知道有没有

// 6.枚举类型 （权限，shapeFlags  patchFlags  有多组值组成的 都可以采用枚举）

// 枚举的值 会自动根据第一个的值来递增 ， 里面是数字的时候可以反举。基本用不到
const enum ROLE { // 异构枚举 表示存储的类型 不统一
  USER,
  ADMIN = "a",
  MANAGER = "b",
}
console.log(ROLE.ADMIN); // 常量枚举 不会生成对象

// null / undefined

let u1: undefined = undefined; // 在非严格模式下 null 和undefined 可以互相赋值
let n1: null = null; // 默认情况下 只能null给null ， undefiend 给undefiend

// 7.void 表示的是空 (这个只在函数的返回值里来用)， undefiend 也是空，所以undefiend可以赋值给void

function sum(): void {}

// 8.never 永远无法到达的, 一般标识never都是用户自己来标识， 告诉代码无法执行
function fn(): never {
  //   throw new Error();
  while (true) {}
}
let a: never = fn(); // never 是任何类型的子类型， 可以赋值给任何类型
let b: number = a;

// 可以用never 来实现完整性保护

// 我们的需求是计算图形的面积 ：

type IRant = {
  // 类型别名， ts 中声明类型
  width: number;
  height: number;
  kind: "rant"; // 字面量类型
};
type ISquare = {
  width: number;
  kind: "square"; // 方形
};
let rant: IRant = { width: 100, height: 20, kind: "rant" };
let square: ISquare = { width: 100, kind: "square" };

function valdiate(obj: never) {}
function getArea(obj: IRant | ISquare) {
  if (obj.kind === "rant") {
    return obj.width * obj.height;
  }
  if (obj.kind === "square") {
    return obj.width * obj.width;
  }
  valdiate(obj); // 可以用于完整性保护，来保证代码的健壮性。 永远无法达到才会走到never
}
let r = getArea(rant);

// 9. 原始类型 symbol 、 bigInt
let s1 = Symbol();
let s2 = Symbol();
let big = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);

// 10 非原始类型

// object
function create(target: object) {} //  reactive()
create({});
create([]);
create(function () {});

// 11.any任意类型，一旦写了any之后 那任何的校验都会失效, 如果不给类型默认就是any类型

// 字符串 数字 布尔 数组 元组 枚举 null undefiend void  never object any （symbol bigInt）

export {};
