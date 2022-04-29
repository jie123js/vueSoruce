
// 装饰器


// 对类的扩展  stage2 这个语法可能会有所更改 vue2 + ts => @  vue3 

function addSpeak(target: any) {
    target.prototype.speak = function () {
        console.log('say')
    }
}

function tuUpper(isUpper: boolean) {
    return function (target: any, key: string) {

        console.log(target, key)
        // target 指代的是类的原型
        let val = ''
        Object.defineProperty(target, key, { // 给原型上添加了个属性
            enumerable: true,
            get() {
                console.log('ok')
                return isUpper ? val.toUpperCase() : val.toLowerCase()
            },
            set(newValue) {
                val = newValue
            }
        })

    }
}

function Enum(isEnum: boolean) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = isEnum
        let oldDrink = descriptor.value;
        descriptor.value = function () {
            console.log('innerDrink')
            oldDrink();
        }
    }
}
@addSpeak
class Person { // 原型上的属性扩展 需要描述可以在类中
    // public speak!: () => void = undefined
    speak(): void { } // 原型上的speak
    @tuUpper(true)
    public name: string = 'xxx'

    @Enum(false)
    public drink() {
        console.log('outerDrink')
    }
}
const person = new Person();
person.speak();

(person as any).__proto__.name = 'ok';

console.log((person as any).__proto__.name)
person.drink()

// 添加原型的方法 









export { }