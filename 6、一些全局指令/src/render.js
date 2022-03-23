import { isObject } from "./utils";
import { createElement, createText } from "./vdom";

export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    //创建元素节点
    const vm = this;
    // console.log(arguments);
    return createElement(vm, ...arguments);
  };
  Vue.prototype._v = function (text) {
    //创建文本节点
    //console.log(arguments);
    const vm = this;

    return createText(vm, text); //描述虚拟节点属于哪个实例
  };
  Vue.prototype._s = function (val) {
    //JSON.stingify()  本身没意义 只是要把对象转出字符串
    if (isObject(val)) {
      return JSON.stringify(val);
    } else {
      return val;
    }
  };
  Vue.prototype._render = function () {
    const vm = this; //这里this就是实例
    let { render } = vm.$options;

    let vnode = render.call(vm);
    //然后这里面执行的时候里面的函数都是在类里面的函数c,v,s都会从原型上找到执行
    //这里为什么可以用vm但是vm里面的取值明明还有一层才可以取到(和test.js相比较)因为我们之前做了代理我们访问vm.name其实是代理到了vm._data.name
    //  console.log(vnode);
    return vnode;
  };
}

/* function anonymous(
    ) {
    with(this){return _c('div',{id:"app"},_v("aaa"+_s(name)+"bbb"+_s(age)+"ccc"))}


    什么的执行过程 
    _s执行参数是_data里面有的name  kobe
    _s是11
    _v是aaaundefinedbbbundefinedccc 因为_s没有返回值是undefined
    _c执行的参数是 3个参数 第一个是div 第二个是{id:app }  第三是undefined


    但是后面如果补充完整_s _v _c函数的返回值那就不会出现上面的undefined的情况了
    } */
