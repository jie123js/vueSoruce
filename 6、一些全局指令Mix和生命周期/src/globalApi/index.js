import Vue from "..";
import { mergeOption } from "../utils";

export function initGlobalAPI(Vue) {
  Vue.options = {}; //这里面放的是全局API 全局属性 ,全局属性会在组件初始化的时候,将全局属性放到每个组件上
  Vue.mixin = function (options) {
    /* console.log(this);
    console.log(Vue);
    这里的this就是Vue */
    //有可能页面会执行好多个Vue.mixin 所以要把这些参数合并起来
    this.options = mergeOption(this.options, options);

    return this;
  };
  Vue.component = function () {};
  Vue.filter = function () {};
}

/* Vue.component  //这样写是全局的 只要有子组件就会把这个全局的component注册到子组件中

new Vue({
    component:{} //这样写是局部的
}) */
