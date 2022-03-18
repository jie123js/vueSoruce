import { patch } from "./vdom/patch";

export function mountComponent(vm) {
  //调用render()  但是这个方法可能每个人都要用,可以封装一下

  let vnode = vm._render(); //拿到虚拟节点,然后去变成真实节点
  vm._updata(vnode);
}

export function lifeCycleMixin(Vue) {
  Vue.prototype._updata = function (vnode) {
    //采用的是 先深度遍历 创建节点 (遇到节点就创建节点,递归创建)

    const vm = this;
    vm.$el = patch(vm.$el, vnode);
  };
}
