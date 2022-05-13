import { ShapeFlags } from "@vue/shared";

export function createRenderer(renderOptions) {
  let {
    // 增加 删除 修改 查询
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
    setText: hostSetText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    createElement: hostCreateElement,
    createText: hostCreateText,
    patchProp: hostPatchProp,
    // 文本节点 ， 元素中的内容
  } = renderOptions;
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container);
    }
  };
  function mountElement(vnode, container) {
    let { type, props, children, shapeFlag } = vnode;
    let el = (vnode.el = hostCreateElement(type));
    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      //文本
      hostSetElementText(el, children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      //数组
      mountChildren(children, el);
    }
    hostInsert(el, container);
  }

  const patch = (n1, n2, container) => {
    //核心patch方法
    if (n1 === n2) return;

    if (n1 == null) {
      //第一次渲染

      mountElement(n2, container);
    } else {
      //更新逻辑
    }
  };

  const render = (vnode, container) => {
    if (vnode == null) {
      //卸载逻辑
    } else {
      //挂载逻辑,这里有初始化的逻辑,也更新diff的逻辑
      patch(container._vnode || null, vnode, container);
    }
    //保存第一次进来的vnode
    container._vnode = vnode;
  };
  return {
    render,
  };
}
