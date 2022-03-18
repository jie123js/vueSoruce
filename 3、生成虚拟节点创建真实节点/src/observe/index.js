import { isArray, isObject } from "../utils";
import { arrayMethods } from "./array";

class Observe {
  constructor(value) {
    Object.defineProperty(value, "_ob_", {
      value: this,
      enumerable: false, // 标识这个属性不能被列举出来，不能被循环到
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
    data.forEach((item) => observe(item)); // 数组里面如果是引用类型那么是响应式的
  }
  walk(data) {
    //todo 循环对象的key且不要原型上面的key
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}
function defineReactive(obj, key, value) {
  //todo data里面嵌套对象的话递归调用(这个是vue2性能差的一个原因)
  observe(value);
  //todo 这是一个闭包这个value不能被销毁
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      console.log("我被处罚");
      observe(newValue); //如果新的值是一个新对象也需要劫持
      if ((newValue = value)) {
        return;
      }
      value = newValue;
    },
  });
}
export function observe(value) {
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
