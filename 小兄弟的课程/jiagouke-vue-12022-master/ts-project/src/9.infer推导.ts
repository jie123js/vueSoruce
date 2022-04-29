// infer 推导类型

// 内置类型 exclude extract pick Omit  required readongly partial NonNullable Record
// extends + 分发  、  in keyof 来实现的



// 内置类型 基于infer来实现   infer就是固定的语法

function getSchool(name: string, age: number, address: string) {
    return { name, age, address }
}

// T 是getSchool的类型 。  T extends   ((...args: any[]) => infer R)
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any
type MyReturnType = ReturnType<typeof getSchool>; // 这个类型很好用


type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never
type MyParamaters = Parameters<typeof getSchool>

// --------------------------

abstract class Person {
    name!: string
    age!: number
    constructor(name: string, age: string) {

    }
}

// typeof 取类型
type InstanceType<T> = T extends abstract new (...args: any[]) => infer R ? R : never

type MyInstanceType = InstanceType<typeof Person>; // 返回值是啥？ Person  用不到


type ConstructorParameters<T> = T extends abstract new (...args: infer P) => any ? P : never
type MyConstructorParameters = ConstructorParameters<typeof Person>; // 返回值是啥？ Person  用不到



// 内置的类型 ReturnType  Parameters  InstanceType  ConstructorParameters


// 元组 转化成联合类型 怎么做？

// [string , number , boolean] => string | number | boolean

type typing = [string, number, boolean]; // string  number  boolean



// 此方法用infer怎么处理  只能配合extends 来使用

type Transfer<T> = T extends Array<infer A> ? A : any

type toUnion = Transfer<typing>

// 联合类型 转成元组 infer



export { }