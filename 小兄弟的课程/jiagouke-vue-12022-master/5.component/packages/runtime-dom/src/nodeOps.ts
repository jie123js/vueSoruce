
export const nodeOps = {
    // 增加 删除 修改 查询
    insert(child,parent,anchor = null){
        parent.insertBefore(child,anchor); // insertBefore 可以等价于appendChild
    },
    remove(child){ // 删除节点
        const parentNode= child.parentNode;
        if(parentNode){
            parentNode.removeChild(child)
        }
    },
    setElementText(el,text){
        el.textContent = text;
    },
    setText(node,text){// document.createTextNode()
        node.nodeValue = text;
    },
    querySelector(selector){
        return document.querySelector(selector)
    },
    parentNode(node){
        return node.parentNode
    },
    nextSibling(node){
        return node.nextSibling
    },
    createElement(tagName){
        return document.createElement(tagName);
    },
    createText(text){
        return document.createTextNode(text);
    }
    // 文本节点 ， 元素中的内容
}