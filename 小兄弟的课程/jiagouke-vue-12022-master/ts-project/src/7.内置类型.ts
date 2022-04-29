// 条件 很多内置的类型 都是基于条件类型的


interface Bird {
    name: '鸟'
}
interface Sky {
    color: '蓝色'
}
interface Fish {
    name: '鱼'
}
interface Water {
    color: '透明'
}
type MyType<T extends Bird | Fish> = T extends Bird ? Sky : Water
// 分发的概念，
// 1） 只能出现在我们的联合类型中，交集类型没有
// 2) 只能出现在裸类型中
type IEnv = MyType<Bird | Fish>; // 这里的分发指代的是分别拿联合类型的每一个进行判断


// -------------------------------内置的条件类型    interface 不能用

type Exclude<T, K> = T extends K ? never : T;  // string | never | boolean
type ExcludeType = Exclude<string | number | boolean, number>; // 在一系列类型中抛除掉某个类型可以使用

// type Extract<T, K> = T extends K ? T : never
type ExtractType = Extract<string | number, string>; // 抽离某个类型 


// 非空类型
let r = document.getElementById('app');

type NonNullable<T> = T extends null | undefined ? never : T
type NoNonNullableType = NonNullable<typeof r>; // 属性类型用的多一些  

// ! 表示的是值是非空的   NoNonNullableType 代表的是类型非空


// 循环的使用 in

interface IInfo {
    num: number,
    name: string
}
interface IFruit {
    color: string,
    age: number,
    taste: string,
    info: IInfo
}
// type Partial<T> = {
//     [Key in keyof T]?: T[Key]
// }
// type PartialType = Partial<IFruit>

// type Readonly<T> = {
//     readonly [Key in keyof T]: T[Key]
// }
// type ReadonlyType = Readonly<IFruit>

// type Required<T> = {
//     [K in keyof T]-?: T[K] // 去掉用问好的,  合并类型
// }
// type ReadonlyType = Required<IFruit>;

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

type IFruitType = DeepPartial<IFruit>
let fruit: IFruitType = {
    info: {
        num: 12345
    }
}
// in 循环 （循环key的）  extends条件 （分发）
// Omit (忽略) /  Pick(精挑细选)

type IPerson = {
    name: string,
    age: number,
    address: string,
    gender: number
}

// type Pick<T extends object, K extends keyof T> = { [Key in K]: T[Key] }
type PickType = Pick<IPerson, 'name' | 'gender'>

// Omit
// type Omit<T extends object, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type OmitType = Omit<IPerson, 'name' | 'gender'>

// exclude extract Omit  pick parital required readonly 内置的


// 继续扩展 我们想让两个对象 合并在一起  {} {} merge


// 两个人的合并 应该用后面的盖掉前面的 

// 你没有的要用我的
function merge<T extends object, K extends object>(a: T, b: K): Pick<T, Exclude<keyof T, keyof K>> & K {
    return { ...a, ...b }
}
// a c - b a  -> c  => {c:21} & {b: 2, a: 'aaa'}

let r6 = merge({ a: 1, c: 21 }, { b: 2, a: 'aaa' });

type Compute<T> = { [K in keyof T]: T[K] }; // 这个方法没有实际意义 只是为了看得的时候清晰

type Temp = Compute<typeof r6>




// ------------------------------------------------------

// Record 来替换object
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

let obj: Record<string, number> = { 'aa': 123 };



function mapping<K extends keyof any, V, R>(obj: Record<K, V>, callback: (key: K, value: V) => R): Record<K, R> {
    let result = {} as Record<K, R>
    for (let key in obj) {
        result[key] = callback(key, obj[key])
    }
    return result
}

let r8 = mapping({ a: 1, b: 2, c: 3, d: 4 }, function (key, value) {

    return value * 3
})

console.log(r8)









export { }