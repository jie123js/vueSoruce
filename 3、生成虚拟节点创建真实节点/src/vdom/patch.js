export function patch(el, vnode) {
  //删除老节点 根据vnode创建新节点,替换掉老节点
  //我们需要先把新节点创建到老节点后面,然后再删除掉老节点
  const elm = createEle(vnode);
  console.log(elm);
  //   把虚拟节点插入当前页面元素的下一个元素前面
  //el.nextSibling//当前元素的下一个元素
  const parentNode = el.parentNode;
  parentNode.insertBefore(elm, el.nextSibling); //el.nextSibling如果不存在就是null,那就相当于appendChild所以需要用 el.parentNode的父亲节点
  parentNode.removeChild(el);
  return elm;
}
//面试有问 虚拟节点的实现 和虚拟节点渲染成真实节点
function createEle(vnode) {
  //判断一下tag是什么类型 要么就是div这种类型要么就是文本(之后会添加其他类型)
  //我们让虚拟节点和真实节点做一个映射关系 为什么那  后续某个虚拟节点更新了,我们可以跟踪到真实节点,并且更新真实节点
  let { tag, data, text, children, vm } = vnode;
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag);
    updateProperties(vnode.el, data);
    children.forEach((child) => {
      vnode.el.appendChild(createEle(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  console.log(vnode);
  return vnode.el;
}
function updateProperties(el, props = {}) {
  //后续diff算法的时候再完善,先不考虑class等
  console.log(props);
  for (let key in props) {
    el.setAttribute(key, props[key]);
  }
  console.log(el);
}
