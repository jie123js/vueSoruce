(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function isFunction(val) {
    return typeof val === "function";
  }
  function isObject(val) {
    return typeof val == "object" && val !== null;
  }
  function isArray(val) {
    return Array.isArray(val);
  }

  // console.log(Array.prototype); //这个是数组里面的方法
  // console.log(Array.__proto__); //这个是ƒ () { [native code] }
  let oldArrayPrototype = Array.prototype;
  let arrayMethods = Object.create(oldArrayPrototype); // 让arrayMethods 通过__proto__ 能获取到数组的方法

  let methods = [// 只有这七个方法 可以导致数组发生变化
  "push", "shift", "pop", "unshift", "reverse", "sort", "splice"];
  methods.forEach(i => {
    arrayMethods[i] = function (...args) {
      oldArrayPrototype[i].call(this, ...args);
      console.log("数组方法重写");
      let insert = [];

      switch (i) {
        case "splice":
          insert = args.slice(2);
          break;

        case "push":
        case "unshift":
          insert = args;
          break;
      } //这里添加了 但是数组里面如果有对象还是需要劫持的  想到index.js有一个劫持数组的方法


      if (insert) this._ob_.observeArray(insert);
    };
  });

  class Observe {
    constructor(value) {
      Object.defineProperty(value, "_ob_", {
        value: this,
        enumerable: false // 标识这个属性不能被列举出来，不能被循环到

      });

      if (isArray(value)) {
        // 不让__ob__ 被遍历到
        //value.__ob__ = this; // 我给对象和数组添加一个自定义属性(这样设置的话,会走进observe的逻辑无线递归)
        value.__proto__ = arrayMethods;
        this.observeArray(value); //是让数组里面假如有对象再进行一步监听
      } else {
        this.walk(value);
      }
    }

    observeArray(data) {
      // 递归遍历数组，对数组内部的对象再次重写 [[]]  [{}]
      // vm.arr[0].a = 100;
      // vm.arr[0] = 100;
      data.forEach(item => observe(item)); // 数组里面如果是引用类型那么是响应式的
    }

    walk(data) {
      //todo 循环对象的key且不要原型上面的key
      Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key]);
      });
    }

  }

  function defineReactive(obj, key, value) {
    //todo data里面嵌套对象的话递归调用(这个是vue2性能差的一个原因)
    observe(value); //todo 这是一个闭包这个value不能被销毁

    Object.defineProperty(obj, key, {
      get() {
        return value;
      },

      set(newValue) {
        console.log("我被处罚");
        observe(newValue); //如果新的值是一个新对象也需要劫持

        if (newValue = value) {
          return;
        }

        value = newValue;
      }

    });
  }

  function observe(value) {
    //console.log(value);
    //   if(!isObject(value){
    //       return
    //   }
    if (!isObject(value)) {
      return;
    }

    if (value._ob_) {
      return;
    }

    return new Observe(value);
  }

  function initState(vm) {
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
      }

    });
  }

  function initData(vm) {
    //console.log("初始化vm");
    let data = vm.$options.data; //如果data写的是函数this指向是window所以我们需要用call重置(对call的一个理解call里面如果写个this当第一个参数,意思就是谁调用他就谁当this,不改变原来执行的this)
    //例子 arr.push.call(this) 那这个就是正常执行push方法原来的this其实arr 这样写的好处是可以加多个参数因为call第二个参数可以是数组 arr.push.call(this,...args)

    data = vm._data = isFunction(data) ? data.call(vm) : data; //为什么不能直接用vm.$options.data而是要再整一个_data因为如果data是函数的话,堆地址就变了 就不是同一个了
    // console.log(data === vm.$options.data);  如果data是对象的话 是一样的 但是函数的话就没有get set劫持了 因为指的不是一个堆地址

    observe(data); //! 这一步是为了让外面的vm可以直接通过vm.xxx获取数据做了一层代理
    //? 我发现不用这个vm._data 好像也可以直接把data传过去一样的 都是一个代理空间  但是这里可能是为了让vm上面挂一个_data数据

    for (let key in data) {
      proxy(vm, key, "_data");
    } //? 被观测后的逻辑都可以在这调试
    //console.log(data);
    //data.a.c.push(1); 看看有没有重置成功

  }

  function _initMax(Vue) {
    Vue.prototype._init = function (options) {
      const vm = this; //console.log(this);//todo实例对象

      vm.$options = options;
      initState(vm); //初始化

      if (options.el) ;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  _initMax(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
