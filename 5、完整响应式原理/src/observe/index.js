import { isArray, isObject } from "../utils";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observe {
  constructor(value) {
    //如果给一个对象增加
    this.dep = new Dep(); //给对象和数组都增加dep属性   value是对象和数组,那不是把对象也加了污染了吗(如果给一个对象增加一个不存在的属性,我们也希望更新试图{}._ob_.dep =>watcher)
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
//[{},{}]如果是这种会对象取值会默认JSON.stringify就会依赖收集
function dependArray(value) {
  //[[],{}]这种情况也收集有可能在数组里面加数据
  for (let i = 0; value.length > i; i++) {
    let current = value[i];
    //只要是对象或者数组就会有_ob_
    current._ob_ && current._ob_.dep.depend();
    if (Array.isArray(current)) {
      dependArray(current);
    }
  }
}
function defineReactive(obj, key, value) {
  //todo data里面嵌套对象的话递归调用(这个是vue2性能差的一个原因)
  let childOb = observe(value); //如果值是数组就比如这个arr就会进入observe方法 比如data{a:1,arr:[222,2]}
  //数组上面有dep因为上面newObserve的时候this=new dep()

  //要给每个属性都要加一个dep
  let dep = new Dep();

  //todo 这是一个闭包这个value不能被销毁
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          //取属性的时候 会对对应值本身是数组或者对象的值进行依赖收集如data:{a:[1,2,3],b:{c:1}}
          childOb.dep.depend();
          if (Array.isArray(value)) {
            //可能是数组套数组那都得依赖收集
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newValue) {
      observe(newValue); //如果新的值是一个新对象也需要劫持
      if (newValue === value) {
        return;
      }
      value = newValue;
      dep.notify();
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
