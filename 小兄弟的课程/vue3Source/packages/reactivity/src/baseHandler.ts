import { activeEffect, track, trigger } from "./effect";

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
    return Reflect.get(target, key, receiver);
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
