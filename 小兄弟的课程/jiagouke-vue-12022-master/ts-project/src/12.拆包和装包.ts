// 早期是没有defineProperty  

// school.name.get()
// school.name.set()

const school = {
    name: 'zf',
    age: 13
}
// 我们先编写一个带有get和set的类型 
type IProxy<T> = {
    get(): T,
    set(value: any): boolean
}
type IProxify<T> = {
    [K in keyof T]: IProxy<T[K]>
}
function proxify<T>(obj: T): IProxify<T> {
    let r = {} as IProxify<T>
    for (let key in obj) {
        let value = obj[key];
        r[key] = {
            get() {
                return value
            },
            set(newValue) {
                return value = newValue
            }
        }
    }
    return r
}
let r = proxify(school)

function unProxify<T>(obj: IProxify<T>): T {
    let r = {} as T
    for (let key in obj) {
        let value = obj[key];
        r[key] = value.get()
    }
    return r
}
let r1 = unProxify(r);
r1.name
r1.age




export {

}


// 装包、拆包 ref
// 装饰器的用法
// promise  axios
// namesapce 和  声明文件的编写
// tsconfig 的配置 