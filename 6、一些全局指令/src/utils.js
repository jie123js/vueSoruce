export function isFunction(val) {
  return typeof val === "function";
}
export function isObject(val) {
  return typeof val == "object" && val !== null;
}

export function isArray(val) {
  return Array.isArray(val);
}
let callbacks = [];
let waiting = false;
function flushCallback() {
  callbacks.forEach((fn) => fn());
  callbacks = [];
  waiting = false;
}
//如果多次调用这个方法 会创建好多个promise显然没这个必要
export function nextTick(fn) {
  //这个是最简单的实现异步的方法 vue3就是这样写的
  callbacks.push(fn);
  if (!waiting) {
    //这里面我们的目的是放函数进来的 但是 callbacks.forEach((fn) => fn())不是一个函数  then的第一个参数需要一个函数
    Promise.resolve().then(flushCallback);
    waiting = true;
  }
  return;
}
