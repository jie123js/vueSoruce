import { compileToFunction } from "./compiler";
import { initGlobalAPI } from "./globalApi";
import { _initMax } from "./init";
import { lifeCycleMixin } from "./lifecycle";
import { renderMixin } from "./render";
import { createEle, patch } from "./vdom/patch";
//todo new Vue的时候先做一个初始化操作_init,但是需要先在实例的prototype上挂一个_init方法,这个步骤在_initMax中实现
function Vue(options) {
  this._init(options);
}
_initMax(Vue);
renderMixin(Vue);
lifeCycleMixin(Vue);
initGlobalAPI(Vue);
// 先生成一个虚拟节点
let vm1 = new Vue({
  data() {
    return { name: "jw" };
  },
});
let render1 = compileToFunction(`<div style='color:blue'>{{name}}</div>`);
let oldVnode = render1.call(vm1); // 第一次的虚拟节点
let el1 = createEle(oldVnode);
document.body.appendChild(el1);

let vm2 = new Vue({
  data() {
    return { name: "zf" };
  },
});
// 在生成一个新的虚拟节点  patch
let render2 = compileToFunction(`<div style='color:red'>{{name}}</div>`);
let newVnode = render2.call(vm2);

setTimeout(() => {
  patch(oldVnode, newVnode);
}, 2000);

// setTimeout(() => {
//   patch(oldVnode, newVnode); // 比对两个虚拟节点的差异，更新需要更新的地方
// }, 2000);
export default Vue;
