import { observe } from "./observe";
import { isFunction } from "./utils";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}

function initData(vm) {
  //console.log("初始化vm");
  let data = vm.$options.data;
  //如果data写的是函数this指向是window所以我们需要用call重置
  data = isFunction(data) ? data.call(vm) : data;

  observe(data);
  //console.log(data);
}
