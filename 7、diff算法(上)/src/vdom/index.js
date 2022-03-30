//接受的是实例vm 标签 属性(属性有可能为空) 孩子(这里用了...children  就是接受剩余的参数 这里children是一个数组)
export function createElement(vm, tag, data = {}, ...children) {
  //返回虚拟节点
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
function vnode(vm, tag, data, children, key, text) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text,
  };
}

//vnode就是一个对象 用来描述节点的  和AST很像啊?
// ast 描述语法,没有自己的逻辑,只看语法解析的内容
//vnode 是描述dom结构的 可以去扩展属性
