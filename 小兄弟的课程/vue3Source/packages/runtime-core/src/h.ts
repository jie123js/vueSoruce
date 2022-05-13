//h的用法  h('div')
//h('div',{style:{"color"：“red”}})
// h('div',{style:{"color"：“red”}},'hello')
// h('div','hello')
// h('div',null,'hello','world')
// h('div',null,h('span'))
// h('div',null,[h('span')])

import { isArray, isObject } from "@vue/shared";
import { createVnode, isVnode } from "./vnode";

export function h(type, propsChildren, children) {
  const l = arguments.length;
  //?长度等于2的情况
  // h('div',{style:{"color"：“red”}})
  // h('div',h('span'))
  // h('div',[h('span'),h('span')])
  // h('div','hello')
  if (l === 2) {
    if (isObject(propsChildren) && !isArray(propsChildren)) {
      if (isVnode(propsChildren)) {
        return createVnode(type, null, [propsChildren]); //h('div',h('span'))
      }

      return createVnode(type, propsChildren); //h('div',{style:{"color"：“red”}})
    } else {
      return createVnode(type, null, propsChildren); //h('div',[h('span'),h('span')]) 或者h('div','hello')
    }
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2); //大于3 第三个开始肯定都是孩子
    } else if (l === 3 && isVnode(children)) {
      children = [children];
    }
    return createVnode(type, propsChildren, children);
  }
}
