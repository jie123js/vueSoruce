import { reactive } from "@vue/reactivity";
import { hasOwn, isFunction, isObject, ShapeFlags } from "@vue/shared";
import { proxyRefs } from "packages/reactivity/src/ref";
import { initProps } from "./componentProps";

export let currentInstance = null;
export const setCurrentInstance = (instance) => (currentInstance = instance);
export const getCurrentInstance = () => currentInstance;

export function createComponentInstance(vnode,parent) {
  let instance = {
    //组件的实例
    provides:parent?parent.provides:Object.create(null),//所有的组件用的就是父亲的provide
    parent,
    data: null,
    vnode, //组件的虚拟节点
    subtree: null, //渲染的组件内容
    isMounted: false,
    update: null,
    propsOptions: vnode.type.props, //组件自身接受的props
    props: {}, //父组件传来的
    attrs: {}, //父组件传来的没有接受的
    proxy: null, //这个值又包括data(state)里面的值也包括props里面的值
    render: null,
    setupState: {},
    slots: {},
  };
  return instance;
}

const publicPropertyMap = {
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
};

const publicInstanceProcy = {
  get(target, key) {
    const { data, props, setupState } = target;
    if (data && hasOwn(data, key)) {
      return data[key];
    } else if (setupState && hasOwn(setupState, key)) {
      return setupState[key];
    } else if (props && hasOwn(props, key)) {
      return props[key];
    }
    //this.$attrs
    //this.$slots
    let getter = publicPropertyMap[key]; //key是$attrs
    if (getter) {
      return getter(target);
    }
  },
  //这里没有this问题不需要用Reflect
  set(target, key, value) {
    const { data, props, setupState } = target;

    if (data && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (setupState && hasOwn(setupState, key)) {
      setupState[key] = value;
      return true; //todo 可写可不写下面统一return true了
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

function initSlot(instance, children) {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    instance.slots = children; //保留
  }
}

export function setupComponent(instance) {
  let { props, type, children } = instance.vnode;
  initProps(instance, props);

  initSlot(instance, children);

  instance.proxy = new Proxy(instance, publicInstanceProcy);

  let data = type.data;
  if (data) {
    if (!isFunction(data)) {
      return console.warn("data should function");
    }
    instance.data = reactive(data.call(instance.proxy));
  }
  let setup = type.setup;
  if (setup) {
    const setupContext = {
      //典型的发布订阅模式
      //todo自定义事件其实就是靠props实现的
      emit: (event, ...args) => {
        const eventName = `on${event[0].toUpperCase() + event.slice(1)}`;
        //找到虚拟节点的属性 有存放props的
        const handler = instance.vnode.props[eventName];
        handler && handler(...args);
      },
      attrs: instance.attrs,
      slots: instance.slots,
    };

    setCurrentInstance(instance);

    const setupResult = setup(instance.props, setupContext);

    setCurrentInstance(null);

    if (isFunction(setupResult)) {
      instance.render = setupResult;
    } else if (isObject(setupResult)) {
      instance.setupState = proxyRefs(setupResult);
      //instance.render = type.render  //todo 写这里好理解点  统一写下面
    }
  }
  if (!instance.render) {
    instance.render = type.render;
  }
}
