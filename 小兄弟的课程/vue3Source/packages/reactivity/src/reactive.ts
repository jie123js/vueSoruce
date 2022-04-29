import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";
const reactiveMap = new WeakMap();


export function reactive(target) {
  if (!isObject(target)) {
    return;
  }
  /* 这个是处理这种情况的缓存
   let obj = {name:'zj'}
    let r1 = reactive(obj)
    let r2 =reactive(obj)
  */
  let exisitingProxy = reactiveMap.get(target);
  if (exisitingProxy) {
    return exisitingProxy;
  }
  //todo 出现对代理过的对象再进行代理
   /* 这个是处理这种情况的缓存
   let obj = {name:'zj'}
    let r1 = reactive(obj)
    let r2 =reactive(r1)
  */
 if(target[ReactiveFlags.IS_REACTIVE]){
     return target
 }
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}
