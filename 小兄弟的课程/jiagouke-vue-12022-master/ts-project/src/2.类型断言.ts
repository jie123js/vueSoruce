// 类型断言  有些属性我们并不知道是什么类型， 那这个时候我就可以采用断言的方式

let n!: number | string; // 联合类型只能 取到公共的方法或者属性

// n = 1; // 会根据赋予的值来进行推断

// as 语法

(n as any as boolean).valueOf; // 风险你要自己承担，万一n 是个数字 那么后果只能自己承担. 双重断言，一般不建议使用。 因为会改变类型关系

let ele: HTMLElement | null = document.getElementById("app");

// js 中的链判断预算福 表示有值 再去取值 （取值操作符）
(ele as HTMLElement).style.background = "red"; // 断言

// ! ts的符号 非空断言
let ele1: HTMLElement = document.getElementById("app")!;
(<HTMLElement>ele).style.background = "red";
// 类型断言可能会有安全性问题  as  !  <HTMLElement>ele (这个叫断言，不是泛型)

// 类型还可以是字面量的

type IDirection = "up" | "down" | "left" | "right"; // 枚举 拿到的是值， 这个是类型
let direction: IDirection = "right";

// 补充说明 联合类型 是并集吗？ 我们在ts中就把他称之为并集 |
// 交集 &

type Person1 = { name: string; handsome: string };
type Person2 = { name: string; height: string };

type Person3 = Person1 | Person2; // 并集 , 只能取出共享的属性

let person1: Person1 = { name: "zs1", handsome: "100" };
let person2: Person2 = { name: "zs2", height: "100" };

let person3: Person3 = { name: "zs2", height: "100", handsome: "100" };
type Person4 = Person1 & Person2; // 交集 ，就是要满足两方的 人既能给A 又能给B
let person4: Person4 = { name: "zs1", handsome: "100", height: "100" };
// person1 要求要满足有name 和handsome 多了可以 不能少 安全
person1 = person4;
person2 = person4;

//  ts中这样定义：并集就是联合类型  交集就是交叉类型
export {};

// 函数  类  接口 泛型 ，内置类型
