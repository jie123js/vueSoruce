//type   props children

import { isArray, isObject, isString, ShapeFlags } from "@vue/shared";
export const Text = Symbol("Text"); //处理边界情况 如果孩子是文本  render(h(Text, 'hello'), app)
export const Fragment = Symbol("Fragment");
export function isVnode(value) {
  return !!(value && value.__v_isVnode);
}
export function isSameVnode(n1, n2) {
  //是否相同  标签   key
  return n1.type === n2.type && n1.key === n2.key;
}
// 1.
// <div>
//     <h1></h1>
//     <h1></h1>
// </div>
// 2.<div>123</div>
// 第一个div里面有2个h1那就需要循环创建
// 第二个就一个孩子123就不需要循环创建

//虚拟节点有很多: 组件的 元素的 文本的
export function createVnode(type, props, children = null, patchFlag?) {
  // 组合方案 shapeFlag  我想知道一个元素中包含的是一个还是多个儿子 比如上面的2个div
  let shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0; //先处理是字符串的如果是字符串表示是元素 元素就是1 否则就是文本0  比如(h('h1))这就是一个元素
  //虚拟DOM 可以跨平台 diff算法  性能好  真实DOM属性多
  const vnode = {
    type,
    props,
    children,
    el: null, //虚拟节点上对应的真实节点,diff算法用的
    key: props?.["key"], //?.  相当于&&
    __v_isVnode: true,
    shapeFlag,
    patchFlag,
  };

  if (children) {
    let type = 0;
    if (isArray(children)) {
      //如果是数组
      type = ShapeFlags.ARRAY_CHILDREN;
    } else if (isObject(children)) {
      //说明是带有组件插槽的
      type = ShapeFlags.SLOTS_CHILDREN;
    } else {
      //除了数组就是数字和字符串 但是创建节点传参需要是字符串类型 我们统一转成字符串
      children = String(children);
      type = ShapeFlags.TEXT_CHILDREN; //文本节点
    }
    vnode.shapeFlag = vnode.shapeFlag | type; //表示虚拟节点然后里面是一个元素然后里面是数字还是文本
  }

  if (currentBlock && vnode.patchFlag > 0) {
    currentBlock.push(vnode);
  }

  return vnode;
}

let currentBlock = null;

export { createVnode as createElementVNode };

export function openBlock() {
  //用一个数组来收集多个动态节点
  currentBlock = [];
}

export function createElementBlock(type, props, children, patchFlag) {
  return setupBlock(createVnode(type, props, children, patchFlag));
}

function setupBlock(vnode) {
  vnode.dynamicChildren = currentBlock;
  currentBlock = [];
  return vnode;
}

export function toDisplayString(val) {
  return isString(val)
    ? val
    : val == null
    ? ""
    : isObject(val)
    ? JSON.stringify(val)
    : String(val);
}
