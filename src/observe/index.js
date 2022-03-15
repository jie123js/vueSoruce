import { isArray, isObject } from "../utils";
import { arrayMethods } from "./array";

class Observe {
  constructor(value) {
    if (isArray(value)) {
      console.log(value);

      value.__proto__ = arrayMethods;
    } else {
      this.walk(value);
    }
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
  return new Observe(value);
}
