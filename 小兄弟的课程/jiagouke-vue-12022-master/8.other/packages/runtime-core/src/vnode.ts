
// type  props  children

import { isArray, isFunction, isObject, isString, ShapeFlags } from "@vue/shared";
import { isTeleport } from "./components/Teleport";
export const Text = Symbol('Text')
export const Fragment = Symbol('Fragment')
export function isVnode(value){
    return !!(value && value.__v_isVnode)
}
export function isSameVnode(n1,n2){ // 判断两个虚拟节点是否是相同节点，套路是1）标签名相同 2） key是一样的
    return (n1.type === n2.type) && ( n1.key === n2.key)

}
// 虚拟节点有很多：组件的、元素的、文本的   h('h1')
export function createVnode(type,props,children = null,patchFlag = 0){
    // 组合方案 shapeFlag  我想知道一个元素中包含的是多个儿子还是一个儿子  标识 
    let shapeFlag = 
        isString(type) ? ShapeFlags.ELEMENT : 
        isTeleport(type) ?  ShapeFlags.TELEPORT: // 针对不同的类型增添shapeFlag
        isFunction(type) ? ShapeFlags.FUNCTIONAL_COMPONENT:
        isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0;
    // 虚拟dom就是一个对象，diff算法。 真实dom的属性比较多
    const vnode = { // key
        type,
        props,
        children,
        el:null, // 虚拟节点上对应的真实节点，后续diff算法
        key:props?.['key'],
        __v_isVnode:true,
        shapeFlag,
        patchFlag,
    }
    if(children){
        let type = 0;
        if(isArray(children)){
            type = ShapeFlags.ARRAY_CHILDREN;
        }else if(isObject(children)){
            type = ShapeFlags.SLOTS_CHILDREN; // 这个组件是带有插槽的
        }else{
            children = String(children);
            type = ShapeFlags.TEXT_CHILDREN;
        }
        vnode.shapeFlag |= type
    }

    if(currentBlock && vnode.patchFlag > 0){
            currentBlock.push(vnode);
    }
    return vnode
}

export {createVnode as createElementVNode}
let currentBlock = null;


export function openBlock(){ // 用一个数组来收集多个动态节点 
    currentBlock = [];
}
export function createElementBlock(type,props,children,patchFlag){  
    return setupBlock(createVnode(type,props,children,patchFlag))
}

function setupBlock(vnode){
    vnode.dynamicChildren = currentBlock;
    currentBlock = null;
    return vnode;
}
// export function _createElementVNode(){

// }
export function toDisplayString(val){
    return isString(val) ? val : val == null ? '':isObject(val)?JSON.stringify(val):String(val);
}