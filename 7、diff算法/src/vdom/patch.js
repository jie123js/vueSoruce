import { isSameVnode } from ".";

export function patch(oldVnode, vnode) {
  //删除老节点 根据vnode创建新节点,替换掉老节点
  //我们需要先把新节点创建到老节点后面,然后再删除掉老节点
  //todo 如果是首次渲染老节点是真实节点 真实节点的nodeType是一定存在的,那就走原来的逻辑
  if (oldVnode.nodeType) {
    const elm = createEle(vnode);
    //   把虚拟节点插入当前页面元素的下一个元素前面
    //el.nextSibling//当前元素的下一个元素
    const parentNode = oldVnode.parentNode;
    parentNode.insertBefore(elm, oldVnode.nextSibling); //el.nextSibling如果不存在就是null,那就相当于appendChild所以需要用 el.parentNode的父亲节点
    parentNode.removeChild(el);
    console.log(elm.nodeType);
    return elm;
  } else {
    if (!isSameVnode(oldVnode, vnode)) {
      //如果新旧节点不一样,删除老的,替换新的
      //createEle(vnode)新的真实节点    oldVnode.el老的真实节点(之前生成虚拟节点的时候都有在虚拟节点上挂了一个el)
      return oldVnode.el.parentNode.replaceChild(createEle(vnode), oldVnode.el);
    }
    //下面是2个节点一样的时候
    //是相同节点,先复用节点
    let el = (vnode.el = oldVnode.el);
    /*  文本节点科普
    在 DOM 处理中一个普遍的错误是，认为元素节点包含文本。
    不过，元素节点的文本是存储在文本节点中的。
    在这个例子中：<year>2005</year>，元素节点 <year>，拥有一个值为 "2005" 的文本节点。
    "2005" 不是 <year> 元素的值！ 
    */
    //如果是文本节点
    if (!oldVnode.tag) {
      //如果没有tag那就是文本,因为是相同的节点,所以一个是文本另一个一点也是文本,所以这个if做一个的判断就够了
      if (oldVnode.text !== vnode.text) {
        return (el.textContent = vnode.text);
      }
    }
    //元素
    updateProperties(vnode, oldVnode.data);
  }
}
//面试有问 虚拟节点的实现 和虚拟节点渲染成真实节点
export function createEle(vnode) {
  //判断一下tag是什么类型 要么就是div这种类型要么就是文本(之后会添加其他类型)
  //我们让虚拟节点和真实节点做一个映射关系 为什么那  后续某个虚拟节点更新了,我们可以跟踪到真实节点,并且更新真实节点
  let { tag, data, text, children, vm } = vnode;
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag);
    updateProperties(vnode, data);
    children.forEach((child) => {
      vnode.el.appendChild(createEle(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
function updateProperties(vnode, oldProps = {}) {
  //后续diff算法的时候再完善,先不考虑class等

  //这里的逻辑 可能是初次渲染,初次渲染直接用oldProps给vnode的el赋值即可
  let el = vnode.el;
  let newProps = vnode.data || {}; //有可能节点没有属性给个空

  //新旧比对
  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};

  for (let key in oldStyle) {
    //老的样式有,新的没有,就删除
    if (!newStyle[key]) {
      el.style[key] = "";
    }
  }
  for (let key in newProps) {
    //直接用新的顶掉老的就可以 (如果老得也有浏览器会帮我们处理)
    if (key == "style") {
      for (let key in newStyle) {
        el.style[key] = newStyle[key];
      }
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key);
    }
  }
}
