'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = (val) => typeof val == 'object' && val !== null;
const extend = Object.assign;
// +=   LET XXX = A+B
// |=   LET XXX = A | B

function effect(fn, option = {}) {
    //fn默认是不具备数据变化更新视图的功能
    let effect = createReactiveEffect(fn, option); //把fn包裹成一个响应式的函数
    if (!option.lazy) {
        effect();
    }
    return effect;
}
let uid = 0;
let activeEffect;
function createReactiveEffect(fn, option) {
    const effect = function () {
        //需要把effect暴露出去
        activeEffect = effect; //类似以前vue2的 Dep.target = watcher
        fn();
        activeEffect = null;
    };
    effect.id = uid++;
    effect._isEffect = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = option;
    return effect;
}
const targetMap = new WeakMap(); //为什么里面不用weakmap因为weakmap的key必须是对象
function track(target, type, key) {
    //创建一个{obj:(name:[effect.effect])}  建是对象,值是一个map,map里面值是一个set
    if (!activeEffect) {
        //不在effet里面的不进行依赖收集
        return;
    }
    console.log(111);
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
    }
    console.log(targetMap);
}
function trigger(target, key, value) {
    let depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    const effects = depsMap.get(key);
    effects.forEach((effect) => effect());
}

const get = createGetter();
const readonlyGet = createGetter(true);
const shallowGet = createGetter(false, true);
const shallowReadonlyGet = createGetter(true, true);
const set = createSetter();
const readonlySet = {
    set(target, key) {
        console.warn(`cannot set on ${key},readonly`);
    },
};
function createSetter() {
    return function set(target, key, value, reactiver) {
        //value是设置值,其他是一样的
        //Reflect.xxx都会有布尔值的返回值
        let res = Reflect.set(target, key, value, reactiver); //等价于 target[key]=value
        console.log("设置值", key, value);
        //触发更新逻辑
        trigger(target, key);
        return res; //本来这个语法就是要返回一个true的  然后Reflect.xxx都会有布尔值的返回值
    };
}
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, reactiver) {
        let res = Reflect.get(target, key, reactiver); //todo 这2个写法等价 target[key]
        //procy一般和reflect联合使用
        if (!isReadonly) {
            //如果对象是一个仅读的属性,那么意味着对象不可能被更改,也就不会更新试图,不需要增添依赖收集
            //不是仅读的才去收集依赖
            track(target, "get", key);
        }
        console.log(target[key]);
        if (shallow) {
            //如果是浅代理就不用递归了
            return res;
        }
        //这个就是 取值了才会去递归 不会一上来就把对象里面包对象的值全部递归,这就是vue3比2好的一些地方
        //  return isReadonly ? readonly(res) : reactive(res); //懒代理,只有取值的时候才会去代理
        //!下面这样写会好理解一点,但是没必要,因为前面已经判断过是不是对象了
        if (isObject(res)) {
            //如果是对象就递归代理,但是不是一开始就代理,是用到了再代理
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
const mutableHandlers = {
    get: get,
    set,
};
const shallowReactiveHandlers = {
    get: shallowGet,
    set,
};
const readonlyHandlers = extend({
    get: readonlyGet,
}, readonlySet);
const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet,
}, readonlySet);

//const reactiveMap = {}  如果等于对象  对象的key不能是对象
const reactiveMap = new WeakMap(); //弱引用 map的key是可以用对象的 做缓存
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
function reactive(target) {
    //mutableHandlers
    return createReactiveObject(target, mutableHandlers, reactiveMap);
}
function shallowReactive(target) {
    //shallowReactiveHandlers
    return createReactiveObject(target, shallowReactiveHandlers, shallowReactiveMap);
}
function readonly(target) {
    //readonlyHandlers
    return createReactiveObject(target, readonlyHandlers, readonlyMap);
}
function shallowReadonly(target) {
    //shallowReadonlyHandlers
    return createReactiveObject(target, shallowReadonlyHandlers, shallowReadonlyMap);
}
function createReactiveObject(target, baseHandlers, proxyMap) {
    if (!isObject(target)) {
        return target;
    }
    //const proxyMap = isReadonly ? readonlyMap : reactiveMap;
    const existsProxy = proxyMap.get(target);
    if (existsProxy) {
        return existsProxy;
    }
    //创建代理对象 ,reactive(reactive({})) 做缓存 不要重复代理
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}

exports.effect = effect;
exports.reactive = reactive;
exports.readonly = readonly;
exports.shallowReactive = shallowReactive;
exports.shallowReadonly = shallowReadonly;
//# sourceMappingURL=reactivity.cjs.js.map
