import { observe } from "./observe";
import { isFunction } from "./utils";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}
function proxy(vm, key, source) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    },
  });
}
function initData(vm) {
  //console.log("初始化vm");
  let data = vm.$options.data;
  //如果data写的是函数this指向是window所以我们需要用call重置(对call的一个理解call里面如果写个this当第一个参数,意思就是谁调用他就谁当this,不改变原来执行的this)
  //例子 arr.push.call(this) 那这个就是正常执行push方法原来的this其实arr 这样写的好处是可以加多个参数因为call第二个参数可以是数组 arr.push.call(this,...args)
  data = vm._data = isFunction(data) ? data.call(vm) : data;

  //为什么不能直接用vm.$options.data而是要再整一个_data因为如果data是函数的话,堆地址就变了 就不是同一个了
  // console.log(data === vm.$options.data);  如果data是对象的话 是一样的 但是函数的话就没有get set劫持了 因为指的不是一个堆地址
  observe(data);

  //! 这一步是为了让外面的vm可以直接通过vm.xxx获取数据做了一层代理
  //? 我发现不用这个vm._data 好像也可以直接把data传过去一样的 都是一个代理空间  但是这里可能是为了让vm上面挂一个_data数据
  for (let key in data) {
    proxy(vm, key, "_data");
  }
  //? 被观测后的逻辑都可以在这调试
  //console.log(data);
  //data.a.c.push(1); 看看有没有重置成功
}
