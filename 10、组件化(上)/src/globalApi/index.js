import { isObject, mergeOption } from "../utils";

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

  Vue.options._base = Vue //为了让组件可以拿到Vue使用里面的方法
  //todo extend
/*   使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。

data 选项是特例，需要注意 - 在 Vue.extend() 中它必须是函数

<div id="mount-point"></div>
 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount('#mount-point') */
  Vue.extend = function(opt){ //会产生一个子类
     const Super = this
     const Sub = function(options){ //创造一个组件,其实就是new这个组件的类(组件的初始化)
      this._init(options) //继承了Vue的实例 所以可以调用这个初始化方法
     }

     //Object.create原理
     //todo 这个函数和Vue原理无关
    //  function create(parentPrototype){
    //   const Fn = function(){}
    //   Fn.prototype = parentPrototype
    //   return new Fn
    //  }
       
     Sub.prototype = Object.create(Super.prototype) //这样写需要改
     Sub.prototype.constructor = Sub //Object.create会产生一个新的实例作为子类的原型,此时constructor会指向错误,需要修改回来
  
     //需要合并option
     Sub.options = mergeOption(Super.options,opt)  //需要让子类,能拿到我们Vue定义的全局属性
     
     //也会也很多方法子类比如
     Sub.mixin = Vue.mixin
     //....还有很多 不一一列举
     return Sub
    }

  Vue.options.components = {};//存放全局组件
  //Vue.component最终都是会走Vue.extend
  Vue.component = function (id,definition) {
    //definition可以是函数也可以是对象 如果是函数就不处理,如果是对象就用extend包裹一下
    //组件有可能会写name属性如果写就用,没写就用id
    let name = definition.name||id
    definition.name = name
    if(isObject(definition)){
      definition = Vue.extend(definition)
    }
    Vue.options.components[name] = definition
    console.log(Vue.options.components);
  };
  // Vue.filter = function () {};
}

/* Vue.component  //这样写是全局的 只要有子组件就会把这个全局的component注册到子组件中

new Vue({
    component:{} //这样写是局部的
}) */


