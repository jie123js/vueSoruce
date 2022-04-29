// 命名空间  （模块的目的是什么？）


// 家里有一个猴子
// namespace Home {
//     export class Monkey { }
//     export namespace Zoo {
//         export let panda = '熊猫'
//     }

// }
// Home.Zoo.panda
// // 外面动物园 有一个猴子
// namespace Zoo {
//     export class Monkey {

//     }
// }
// Zoo.Monkey


// 命名空间最大的功能 并不是写代码的时候用，用它来合并类型  扩展
// 1） 命名空间可以和类来进行合并

class Person { }
namespace Person {
    export let type = '人' // 扩展静态的属性 
}
console.log(Person.type)

// 2）命名空间可以和函数合并   可以"扩展类型"
function $() {

}
namespace $ {
    export namespace fn {
        export let a: string = '1';
    }
}
// console.log($.fn)
// 3） 命名空间可以和枚举合并

// enum AUTH {
//     user = 1
// }
namespace AUTH {
    export let admin: string
}

// 4) 命名空间同名也可以合并 

namespace AUTH {
    export let manager: string
}


// 5) 接口和命名空间不能合并

export { }