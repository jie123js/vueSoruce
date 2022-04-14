import { isReservedTag } from "../../../code/jiagouke20212-vue/6.vue-component/src/utils";
import { isObject } from "../utils";

function createComponent(vm,tag,data,children,key,Ctor){
  if(isObject(Ctor)){//组件的定义一定是通过Vue.extend进行包裹的
    Ctor = vm.$options._base.extend(Ctor) //找到Vue,使用extend方法来包裹组件
  }
  data.hook = {
    //组件的生命周期
    init(vnode){
      //vnode.compoentInstance这个是组件的实例所以可以通过.$el拿到真实节点
      let child =vnode.compoentInstance =  new Ctor({})
      child.$mount()
      //mount挂载完毕后,会产生一个真实节点 这个节点在实例上vm.$el,所以可以把这个实例保存在vnode的一个属性上这里是compoentInstance
      
    },
    prepatch(){

    },
    postpatch(){

    }
  }
  let componentVnode = vnode(vm,tag,data,undefined,key,undefined,{Ctor,children,tag})
 
  return componentVnode
}

//接受的是实例vm 标签 属性(属性有可能为空) 孩子(这里用了...children  就是接受剩余的参数 这里children是一个数组)
export function createElement(vm, tag, data = {}, ...children) {
  //返回虚拟节点
  if(!isReservedTag(tag)){
    let Ctor = vm.$options.components[tag]
    return createComponent(vm,tag,data,children,data.key,Ctor)
  }
  
  return vnode(vm, tag, data, children, data.key, undefined); //元素是没有文本的所有是undefined
}

export function createText(vm, text) {
  //返回虚拟节点
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}
//vue2 性能问题的其中一个,就是这个是递归对比的
export function isSameVnode(oldVnode, newVnode) {
  //2个节点要一样 tag要一样key也得一样 同时key有可能是undefined也有可能有的有key有的没有所以这里最好不用===
  return newVnode.tag === oldVnode.tag && newVnode.key == oldVnode.key;
}
function vnode(vm, tag, data, children, key, text,options) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text,
    //这里为什么不直接写Ctor 因为有可能是对象 如果组件自身的component还没被extend包裹
    componentOptions:options
  };
}

//vnode就是一个对象 用来描述节点的  和AST很像啊?
// ast 描述语法,没有自己的逻辑,只看语法解析的内容
//vnode 是描述dom结构的 可以去扩展属性
