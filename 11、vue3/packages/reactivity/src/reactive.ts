import { isObject } from "@vue/shared";
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";
//const reactiveMap = {}  如果等于对象  对象的key不能是对象
const reactiveMap = new WeakMap(); //弱引用 map的key是可以用对象的 做缓存
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
export function reactive(target: object) {
  //mutableHandlers
  return createReactiveObject(target, mutableHandlers, reactiveMap);
}

export function shallowReactive(target: object) {
  //shallowReactiveHandlers
  return createReactiveObject(
    target,
    shallowReactiveHandlers,
    shallowReactiveMap
  );
}

export function readonly(target: object) {
  //readonlyHandlers
  return createReactiveObject(target, readonlyHandlers, readonlyMap);
}

export function shallowReadonly(target: object) {
  //shallowReadonlyHandlers
  return createReactiveObject(
    target,
    shallowReadonlyHandlers,
    shallowReadonlyMap
  );
}

export function createReactiveObject(target, baseHandlers, proxyMap) {
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
