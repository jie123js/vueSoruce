// 类： 1） 类中的属性定义  实例属性、原型属性   原型方法、 静态方法 (主要目的就是声明类中的this)


/* class Circle {
    // this上声明的属性 必须要提前声明
    // public x: number = 0
    // public y: number = 0
    // public r: number = 0;
    public _r!: number;
    constructor(public x: number, public y: number, r?: number) { // 构造函数和函数的使用一致
        this.x = x;
        this.y = y;
        if (r !== undefined) {
            this._r = r;
        }
    }
}
// 通过修饰符直接将传递的属性绑定到this上
let cicle = new Circle(1, 2); */


// 属性修饰符 有四种   public(公开的)、private（自己访问）、protected（自己和自己的孩子可以访问）、readonly (仅读的属性)

// 修饰符只是针对ts编写代码时有效果，后面在编译成js之后消失了   reaonly 在构造函数中可以随意修改（初始化） 在其他的地方就不能再次修改了
/* class Animal {
    constructor(protected readonly name: string) {
        this.name = 'zf';
        this.name = 'jw'
    }
}
class Cat extends Animal {
    constructor(public age: number, name: string) {
        super(name)
    }
}

const cat = new Cat(100, 'Tom'); */


// 类中依旧可以使用原型属性、方法  es6中其他都是正常的


class Animal {
    constructor(protected name: string) { }
    public eat(): void { // 父类的void 表示不关心子类的返回值
        // return 123
    }
    static drink = '喝水'
    static sleep() {
        console.log('睡觉')
    }
}

// Cat.__proto__ = Animal

class Cat extends Animal {
    // public a;
    constructor(public age: number, name: string) {
        super(name)
        // this.a = 1
    }
    get a() { // 属性访问器
        return 1
    }
    public eat(): string {
        super.eat()
        return '猫的吃'
    }
    static sleep(): string {
        super.sleep()
        return 'abc'
    }
}

const cat = new Cat(13, 'TOM')
// 我们这样通过public定义的属性是实例的属性 还是 原型的属性？
// super 在构造函数中指代的是父类,静态方法中也指代父类 ， 在原型方法中指代的是父类的原型

// 我们很少写类的继承了，  函数的组合 》 继承的

// 静态方法就是类本省的方法
Cat.sleep()


// 类里面还有一个 装饰器 

export { }