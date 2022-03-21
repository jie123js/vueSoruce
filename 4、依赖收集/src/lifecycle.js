import Watcher from "./observe/watcher";
import { patch } from "./vdom/patch";

export function mountComponent(vm) {
  //调用render()  但是这个方法可能每个人都要用,可以封装一下

  let vnode = vm._render(); //拿到虚拟节点,然后去变成真实节点

  let updataComponents = () => {
    vm._updata(vm._render());
  };

  //updataComponents(); //执行这个函数页面才会渲染更新
  //把这个逻辑渲染放到watcher
  //每个组件都有一个watcher
  new Watcher(
    vm,
    updataComponents,
    () => {
      console.log("后续逻辑");
    },
    true
  );
}

export function lifeCycleMixin(Vue) {
  Vue.prototype._updata = function (vnode) {
    //采用的是 先深度遍历 创建节点 (遇到节点就创建节点,递归创建)

    const vm = this;
    vm.$el = patch(vm.$el, vnode);
  };
}
