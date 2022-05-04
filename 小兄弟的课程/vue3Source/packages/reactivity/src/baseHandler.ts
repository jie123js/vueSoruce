import { isObject } from "@vue/shared";
import { activeEffect, track, trigger } from "./effect";
import { reactive } from "./reactive";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    track(target, "get", key);
    // activeEffect;
    let res = Reflect.get(target, key, receiver);
    if(isObject(res)){
      return reactive(res)
    }
    return res
  },
  set(target, key, value, receiver) {
    let oldValue = target[key];
    let result = Reflect.set(target, key, value, receiver);
    //todo 这个是做一个优化如果修改值没变的话就不触发更新
    if (oldValue !== value) {
      //要更新
      trigger(target, "set", key, value, oldValue);
    }

    return result;
  },
};
