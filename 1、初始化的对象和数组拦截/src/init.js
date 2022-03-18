import { initState } from "./state";

export function _initMax(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    //console.log(this);//todo实例对象
    vm.$options = options;
    initState(vm); //初始化
    if (options.el) {
      // console.log(options.el);
    }
  };
}
