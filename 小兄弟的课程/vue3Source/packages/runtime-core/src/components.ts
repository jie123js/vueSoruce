import { reactive } from "@vue/reactivity";
import { hasOwn, isFunction } from "@vue/shared";
import { initProps } from "./componentProps";

export function createComponentInstance(vnode) {
  let instance = {
    //组件的实例
    data: null,
    vnode, //组件的虚拟节点
    subtree: null, //渲染的组件内容
    isMounted: false,
    update: null,
    propsOptions: vnode.type.props, //组件自身接受的props
    props: {}, //父组件传来的
    attrs: {}, //父组件传来的没有接受的
    proxy: null, //这个值又包括data(state)里面的值也包括props里面的值
    render:null
  };
  return instance;
}

const publicPropertyMap = {
  $attrs: (i) => i.attrs,
};

const publicInstanceProcy = {
  get(target, key) {
    
    const { data, props } = target;
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    }
    //this.$attrs
    let getter = publicPropertyMap[key]; //key是$attrs
    if (getter) {
      return getter(target);
    }
  },
  //这里没有this问题不需要用Reflect
  set(target, key, value) {
     
    const { data, props } = target;

    
    if (data && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (props && hasOwn(props, key)) {
      //用户不能修改子组件里面的props ,因为用户操作的this是代理对象proxy,这里我们屏蔽了set的更改
      //但是instance.props 是可以拿到真实的props 这个是响应式的 可以修改的
      console.warn("attempting to mutate prop" + " " + (key as string));
      return false;
    }
    //attrs不用修改 因为是个方法
    return true;
  },
};
export function setupComponent(instance) {
  let { props ,type} = instance.vnode;
  initProps(instance, props);

  instance.proxy = new Proxy(instance, publicInstanceProcy);

  let data = type.data
  if(data){
      if(!isFunction(data)){
          return console.warn('data should function');
      }
      instance.data = reactive(data.call(instance.proxy))
  }
  instance.render = type.render
}
