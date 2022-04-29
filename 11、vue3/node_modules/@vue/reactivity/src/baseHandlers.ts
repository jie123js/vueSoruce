import { extend, isObject } from "@vue/shared";
import { track, trigger } from "./effect";
import { reactive, readonly } from "./reactive";

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
    trigger(target, key, value);
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

export const mutableHandlers = {
  get: get,
  set,
};

export const shallowReactiveHandlers = {
  get: shallowGet,
  set,
};

export const readonlyHandlers = extend(
  {
    get: readonlyGet,
  },
  readonlySet
);

export const shallowReadonlyHandlers = extend(
  {
    get: shallowReadonlyGet,
  },
  readonlySet
);
