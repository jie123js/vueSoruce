import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";

export function watch(source, cb) {
  let getter;
  let oldValue;

  if (isReactive(source)) {
    //如果传进来的是一个对象,需要递归处理,把里面的每个属性访问一下,进行依赖收集

    getter = () => traversal(source);
  } else if (isFunction(source)) {
    getter = source;
  } else {
    return;
  }
  let cleanup;
  const onCleanup = (fn) => {
    cleanup = fn;
  };
  const job = () => {
    if (cleanup) cleanup();
    const newValue = effect.run();
    cb(newValue, oldValue, onCleanup);
    oldValue = newValue;
  };
  const effect = new ReactiveEffect(getter, job); //监控自己的函数,变化后重新执行JOB
  oldValue = effect.run();
}

function traversal(value, set = new Set()) {
  if (!isObject(value)) {
    return value;
  }
  if (set.has(value)) {
    return value;
  }
  set.add(value);
  for (let key in value) {
    traversal(value[key], set);
  }
  return value;
}
