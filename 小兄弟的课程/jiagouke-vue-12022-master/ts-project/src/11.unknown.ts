
// unknown 类型 也是一个ts中的类型 高级类型， 不知道 为啥不用any呢？

// any 叫做不检测了，随意。 unknown 要进行类型检测 （但是我确实不知道是什么）



let a: number = 1;
let b: unknown = 2;  // 我们的类型如果是unkown 不能直接使用 + - * /

// 我们在使用unkown的时候 要保证安全    (只要你做了断言或者类型保护就可以)

let c: unknown = 1

function isFunction(val: any): val is () => void { // 来声明自己的类型
    return true
}
if (isFunction(c)) {
    c(); // 运行报错, unknown 的特点就是 不能直接获取属性 和调用， (只要你做了断言或者类型保护就可以)
}

function sum(a: number, b: unknown) {
    if (typeof b === 'string') {
        return a + b
    }
    if (typeof b === 'number') {
        return a + b;
    }
    return b as boolean
}

const data: unknown = JSON.parse(`{name:"zf"}`)

function isXx(val: any): val is { name: string, age: number } {
    return val.name && val.age
}
if (isXx(data)) {
    data.name
}

// 特殊性情况 unknown 和 逼得类型放在一起 


type X = unknown | string; // 一般不这么用   unknown和任何类型取交集 返回的是另一个类型 一个完全不知道的和已经知道的 = 已经知道的
// 联合类型 一个不知道的和知道的  = 不知道了


type X1 = keyof unknown; // 不能keyof  any可以keyof


// 当我们使用的时候不知道他的具体类型 就不要在使用any了，采用unknown


// 声明文件 namespace  配置文件使用  三斜线指令 拆包装包  装饰器






export { }