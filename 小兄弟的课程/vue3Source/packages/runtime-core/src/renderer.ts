import { isString, ShapeFlags } from "@vue/shared";
import { getSequence } from "./sequence";
import { createVnode, Fragment, isSameVnode } from "./vnode";

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
  //边界处理 如果还是是文本就转一下
  const normalize = (children, i) => {
    if (isString(children[i])) {
      let vnode = createVnode(Text, null, children[i]);
      children[i] = vnode;
    }
    return children[i];
  };
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      let child = normalize(children, i);
      patch(null, child, container);
    }
  };
  function mountElement(vnode, container, anchor) {
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
    hostInsert(el, container, anchor);
  }
  const processText = (n1, n2, container) => {
    if (n1 === null) {
      n2.el = hostCreateText(n2.children);
      hostInsert(n2.el, container);
    } else {
      //文本内容发生变化,复用老的节点
      const el = (n2.el = n1.el);

      if (n1.children !== n2.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const patchProps = (oldProps, newProps, el) => {
    for (let key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }
    for (let key in oldProps) {
      if (newProps[key] == null) {
        hostPatchProp(el, key, oldProps[key], undefined);
      }
    }
  };

  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i]);
    }
  };

  const patchKeyChildren = (c1, c2, el) => {
    //diff核心 2个儿子差异
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    //todo 这几个都是特殊比较
    //sync from start  从头开始比  如果有一样的复用进行patch对比
    while (i <= e1 && i <= e2) {
      //任何一方停止循环就直接跳出

      let n1 = c1[i];
      let n2 = c2[i];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      i++;
    }

    // //sync from end  从后开始比
    while (i <= e1 && i <= e2) {
      let n1 = c1[e1];
      let n2 = c2[e2];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    // common sequence + mount  多出来的追加
    if (i > e1) {
      if (i <= e2) {
        while (i <= e2) {
          //根据下一个人的索性来当参照物  因为有可能是前面加 也有可能是后面加要区分
          const nextPos = e2 + 1;
          const anchor = nextPos < c2.length ? c2[nextPos].el : null; //如果是空就是像后面加,有值就是前面加

          patch(null, c2[i], el, anchor); //创建新节点到el中
          i++;
        }
      }
    } else if (i > e2) {
      //common sequence + unmount //删除多出来的老的
      if (i <= e1) {
        while (i <= e1) {
          unmount(c1[i]);
          i++;
        }
      }
    }

    //前面是优化diff  下面是乱序比对
    let s1 = i;
    let s2 = i;
    const keyToNewIndexMap = new Map();
    for (let i = s2; i <= e2; i++) {
      //用新的节点创建队列,去老的找有没有
      keyToNewIndexMap.set(c2[i].key, i);
    }
    const toBePatched = e2 - s2 + 1; //新的总个数(进入乱序比对的新的总个数)
    const newIndexToOldindexMap = new Array(toBePatched).fill(0);
    //循环老的元素 ,看一下新的里面有没有,如果有就比较差异, 没有就添加到列表中,老的有新的没有就删除
    for (let i = s1; i <= e1; i++) {
      const oldChild = c1[i]; //老的孩子
      let newIndex = keyToNewIndexMap.get(oldChild.key); //用老的孩子去新的里面找
      if (newIndex == undefined) {
        unmount(oldChild);
      } else {
        //新的位置对应老的位置(就是乱序对比中新的元素在老的里面的位置,但是要加1,防止出现0,因为0是不存在要添加的)
        newIndexToOldindexMap[newIndex - s2] = i + 1;
        patch(oldChild, c2[newIndex], el);
      }
    } //到这只是新老儿子比对,没有移动位置
    // console.log(newIndexToOldindexMap);
    //获取最长子序列
    let increment = getSequence(newIndexToOldindexMap);
    //需要移动位置
    let j = increment.length - 1;
    for (let i = toBePatched - 1; i >= 0; i--) {
      let index = i + s2; //这个是找到乱序对比新的节点里面 乱序比对的最后一个在新节点的位置
      let current = c2[index]; //找到h(这个h是例子里面的h)
      let anchor = index + 1 < c2.length ? c2[index + 1].el : null;
      //这里发现逻辑有问题 因为current可能是新增的没有el,可能是新增逻辑
      if (newIndexToOldindexMap[i] === 0) {
        //[5,3,4,0] ->[1,2]
        //老的里面没有 要新增
        patch(null, current, el, anchor);
      } else {
        if (i != increment[j]) {
          //不是0 说明已经比对过属性和儿子
          hostInsert(current.el, el, anchor);
        } else {
          j--;
        }
      }
    }
    //  console.log(i, e1, e2);
  };

  const patchChildren = (n1, n2, el) => {
    //比较两个儿子的的差异,el是父节点
    const c1 = n1.children;
    const c2 = n2.children;
    const prevShapeFlag = n1.shapeFlag; //之前的
    const shapeFlag = n2.shapeFlag; //之后的

    //文本 空的null 数组

    //比较两个儿子列表的差异
    //新的  老的
    //文本  数组  (删除老儿子,设置文本内容)
    //文本  文本  (更新文本即可)
    //数组  数组  (diff算法)
    //数组  文本  (清空文本,进行挂载)
    //空    数组  (删除所有儿子)
    //空    文本  (清空文本)

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      //新的文本
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        //老的数组
        //删除所以子节点
        unmountChildren(c1); //文本  数组
      }
      //如果老的也是文本,也走这里
      if (c1 !== c2) {
        hostSetElementText(el, c2); //文本 文本   包括了文本和空
      }
    } else {
      //现在为数组或者为空
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          //diff 算法  新老都是数组
          patchKeyChildren(c1, c2, el); //全量比较
        } else {
          //现在不是数组 以前是   (文本和空现在)  删除以前的
          unmountChildren(c1); //空    数组  (删除所有儿子)
        }
      } else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, ""); //新数组  老文本 (清空文本,进行挂载)
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el); //新数组 文本 (清空文本,进行挂载)
        }
      }
    }
  };
  const patchElement = (n1, n2, container) => {
    //先复用节点,再比较属性
    let el = (n2.el = n1.el);
    let oldProps = n1.props || {};
    let newProps = n2.props || {};
    patchProps(oldProps, newProps, el);
    patchChildren(n1, n2, el);
  };
  const processElement = (n1, n2, container, anchor) => {
    if (n1 === null) {
      mountElement(n2, container, anchor);
    } else {
      //元素比对
      patchElement(n1, n2, container);
    }
  };

  const processFragment = (n1, n2, container) => {
    if (n1 == null) {
      mountChildren(n2.children, container);
    } else {
      patchChildren(n1, n2, container);
    }
  };

  const patch = (n1, n2, container, anchor = null) => {
    //核心patch方法
    if (n1 === n2) return;

    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1); //删除老的
      n1 = null; //不设为null  下面逻辑又走对比了  设为null直接走创建逻辑
    }
    const { type, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      case Fragment: //无用标签
        processFragment(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor);
        }
    }
  };

  const unmount = (vnode) => {
    hostRemove(vnode.el);
  };

  const render = (vnode, container) => {
    if (vnode == null) {
      //卸载逻辑
      if (container._vnode) {
        unmount(container._vnode);
      }
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

//文本的处理,需要自己增加类型,因为不能通过document.createElement('文本')

//我们如果传入null的时候在渲染时,则是卸载逻辑,需要将DOM节点删掉

// 1)更新的逻辑思考:
// -如果前后完全不一样,删除老的,添加新的
// -老的和新的一样,复用. 属性可能不一样,在比对属性,更新属性
// - 比儿子
