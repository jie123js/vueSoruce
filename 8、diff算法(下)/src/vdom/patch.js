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
    //比较儿子节点
    let oldChildren = oldVnode.children || [];
    let newChildren = vnode.children || [];
    //情况1:老的有儿子,新的没有
    if (oldChildren.length > 0 && newChildren.length == 0) {
      el.innerHTML = "";
    } //情况2:老的没有,新的有,直接加入
    else if (oldChildren.length == 0 && newChildren.length > 0) {
      newChildren.forEach((child) => {
        el.appendChild(createEle(child));
      });
    } else {
      //新老都有儿子
      updateChildren(el, oldChildren, newChildren);
    }
  }
}

function updateChildren(el, oldChildren, newChildren) {

  /*  第一种  双指针法 头头对比 尾尾对比  
  头头就是 ABCD   ABCDE  头的一样就从头比
  尾尾就是BCD  ABCD  尾巴一样从尾比 */
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  function makeKeyByIndex(children) {
    let map = {};
    children.forEach((item, index) => {
      //key当索引 如果key没有那就是undefined
      map[item.key] = index;
    });
    return map;
  }

  let mapping = makeKeyByIndex(oldChildren);
  //这个条件就是说要新老全部比好,不能只有一方比好(即新老节点的头尾指针都交叉时)
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    //isSameVnode只是比较2个节点一样不一样
    //if1 比较新老第一个元素一样不一样 对应参考图1
    // console.log(oldEndIndex,newEndIndex);
    // console.log(oldStartIndex,newStartIndex);
    if (!oldStartVnode) {
      //乱序对比会置空会undefined 所以这里需要跳过
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      //头头比较
      patch(oldStartVnode, newStartVnode); //这里又递归比较,里面的东西属性啥的,各种差异
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      //尾尾比较
      //比较新老尾部一样  对应参考图2
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      //头尾比较
      //头尾比较 对应图片4
      patch(oldStartVnode, newEndVnode);
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      //尾头比较
      //对应图5  老尾与新头一样  老头和新尾不一样的情况
      patch(oldEndVnode, newStartVnode); //patch只改变属性dom是不会改变的
      el.insertBefore(oldEndVnode.el, oldStartVnode.el); //将尾巴插入到头部去
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
     } else {
      //之前的逻辑都是考虑一些特殊情况对diff进行的优化,但是也有不特殊的乱序
      //对应图6
      //创建一个老节点的key和索引对象
      //第一步先看看新的节点在不在老的节点的索引对象里面
   
      let moveIndex = mapping[newStartVnode.key];
      if (moveIndex == undefined) {
        //如果没有就直接插入到老节点的oldStartVnode(即是老头指针的地方)
        el.insertBefore(createEle(newStartVnode), oldStartVnode.el);
      } else {
        //有的话需要复用
        let moveVnode = oldChildren[moveIndex]; //找到复用的那个点,移动到前面去
        console.log(oldChildren);
        el.insertBefore(moveVnode.el, oldStartVnode.el);
        console.log(oldChildren);
        patch(moveVnode, newStartVnode);
        // //把移走的节点置空
        oldChildren[moveIndex] = undefined;
        console.log(oldChildren);
      }
      //不管如何指针都要走
      newStartVnode = newChildren[++newStartIndex];
    }
  }

  if (newStartIndex <= newEndIndex) {
    //对应参考图1 图2  新的多的情况,把新的加入即可
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      //看一下当前尾节点的下一个元素是否存在,如果存在就插到前面,但是拿到的值是虚拟节点我们要.el获取真实节点
      //如果不存在null,那就是appendChild插到后面去
      let anchor =newChildren[newEndIndex + 1] == null? null: newChildren[newEndIndex + 1].el; //这个值是不会变的,因为尾指针不会动
      //newChildren是虚拟节点要变成真实节点插入
      //insertBefore第二个参数有值就是加前面 没值就是加后面
      el.insertBefore(createEle(newChildren[i]), anchor);
    }
  }
  if (oldStartIndex <= oldEndIndex) {
    //对应图3 ABCD ABC 老的比较多删除
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      // el.removeChild(oldChildren[oldStartIndex]) 这个是我写的 是错的 因为我这样删除的是虚拟节点
      let child = oldChildren[i]; //虚拟节点
      //有可能老的都不要所以要加个判断
      child && el.removeChild(child.el);
    }
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
