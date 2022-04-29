import { reactive } from "@vue/reactivity";
import { isArray, isString, ShapeFlags } from "@vue/shared";
import { ReactiveEffect } from "@vue/reactivity";
import { getSequence } from "./sequence";
import { Text ,createVnode,isSameVnode,Fragment} from "./vnode";
import { queueJob } from "./scheduler";



export function createRenderer(renderOptions){
    let  {
    // 增加 删除 修改 查询
        insert:hostInsert,
        remove:hostRemove,
        setElementText:hostSetElementText,
        setText:hostSetText,
        parentNode:hostParentNode,
        nextSibling:hostNextSibling,
        createElement:hostCreateElement,
        createText:hostCreateText,
        patchProp:hostPatchProp
        // 文本节点 ， 元素中的内容
    } = renderOptions

    const normalize = (children,i)=>{
        if(isString(children[i])){
            let vnode = createVnode(Text,null,children[i])
            children[i] = vnode;
        }
        return children[i];
    }
    const mountChildren = (children,container) =>{
        for(let i = 0; i < children.length;i++){
            let child = normalize(children,i); // 处理后要进行替换，否则childrne中存放的已经是字符串
            patch(null,child,container)
        }
    }
    const mountElement = (vnode,container,anchor)=>{
        let {type,props,children,shapeFlag} = vnode;
        let el = vnode.el = hostCreateElement(type); // 将真实元素挂载到这个虚拟节点上，后续用于复用节点和更新
        if(props){
            for(let key in props){
                hostPatchProp(el,key,null,props[key])
            }
        }
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){ // 文本
            hostSetElementText(el,children)
        }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){ // 数组
            mountChildren(children,el)
        }
        hostInsert(el,container,anchor)
    }

    const processText = (n1,n2,container)=>{
        if(n1 === null){
            hostInsert((n2.el = hostCreateText(n2.children)),container)
        }else{
            // 文本的内容变化了，我可以复用老的节点
            const el =  n2.el = n1.el;
            if(n1.children !== n2.children){
                hostSetText(el,n2.children); // 文本的更新
            }
        }
    }


    const patchProps = (oldProps,newProps,el)=>{
        for(let key in newProps){ // 新的里面有，直接用新的盖掉即可
            hostPatchProp(el,key,oldProps[key],newProps[key]);
        }
        for(let key in oldProps){ // 如果老的里面有新的没有，则是删除
            if(newProps[key] == null){
                hostPatchProp(el,key,oldProps[key],undefined);
            }
        }
    }
    const unmountChildren = (children) =>{
        for(let i = 0; i < children.length;i++){
            unmount(children[i]);
        }
    }
    const patchKeyedChildren = (c1,c2,el) =>{ // 比较两个儿子的差异

        let i = 0;
        let e1 = c1.length-1;
        let e2 = c2.length - 1;

        // 特殊处理..................................................

        // sync from start
        while(i<=e1 && i<=e2){ // 有任何一方停止循环则直接跳出
            const n1 = c1[i];
            const n2 = c2[i];
            if(isSameVnode(n1,n2)){
                patch(n1,n2,el); // 这样做就是比较两个节点的属性和子节点
            }else{
                break;
            }
            i++
        }
        // sync from end
        while(i<=e1 && i<=e2){
            const n1 = c1[e1];
            const n2 = c2[e2];
            if(isSameVnode(n1,n2)){
                patch(n1,n2,el);
            }else{
                break;
            }
            e1--;
            e2--;
        }
        // common sequence + mount
        // i要比e1大说明有新增的 
        // i和e2之间的是新增的部分 

        // 有一方全部比较完毕了 ，要么就删除 ， 要么就添加
        if(i > e1){
            if(i<=e2){
                while(i <=e2){
                    const nextPos = e2 + 1;
                    // 根据下一个人的索引来看参照物
                    const anchor =nextPos < c2.length ?  c2[nextPos].el : null
                    patch(null,c2[i],el,anchor); // 创建新节点 扔到容器中
                    i++;
                }
            }
        }else if(i> e2){
            if(i<=e1){
                while(i<=e1){
                    unmount(c1[i])
                    i++;
                }
            }
        }
        // common sequence + unmount
        // i比e2大说明有要卸载的
        // i到e1之间的就是要卸载的

        // 优化完毕************************************
        // 乱序比对
        let s1 = i;
        let s2 = i;
        const keyToNewIndexMap = new Map(); // key -> newIndex
        for(let i = s2; i<=e2;i++){
            keyToNewIndexMap.set(c2[i].key,i)
        }
        

        // 循环老的元素 看一下新的里面有没有，如果有说明要比较差异，没有要添加到列表中，老的有新的没有要删除
        const toBePatched = e2 - s2 + 1; // 新的总个数
        const newIndexToOldIndexMap = new Array(toBePatched).fill(0); // 一个记录是否比对过的映射表 

       
        
        for(let i = s1; i<=e1; i++){
            const oldChild = c1[i]; // 老的孩子
            let newIndex =  keyToNewIndexMap.get(oldChild.key); // 用老的孩子去新的里面找
            if(newIndex == undefined){
                unmount(oldChild); // 多余的删掉
            }else{
                // 新的位置对应的老的位置 , 如果数组里放的值>0说明 已经pactch过了
                newIndexToOldIndexMap[newIndex-s2] = i+1; // 用来标记当前所patch过的结果
                patch(oldChild,c2[newIndex],el)
            }
        } // 到这这是新老属性和儿子的比对，没有移动位置
        

         // 获取最长递增子序列
         let increment = getSequence(newIndexToOldIndexMap)

        // 需要移动位置
        let j = increment.length - 1;
        for(let i =toBePatched - 1; i>=0; i-- ){ // 3 2 1 0
            let index = i + s2;
            let current = c2[index]; // 找到h
            let anchor = index + 1 < c2.length ? c2[index+1].el : null;
            if(newIndexToOldIndexMap[i] === 0){ // 创建   [5 3 4 0]  -> [1,2]
                patch(null,current,el,anchor)
            }else{ // 不是0 说明是已经比对过属性和儿子的了
                if(i !=  increment[j] ){
                    hostInsert(current.el,el,anchor); // 目前无论如何都做了一遍倒叙插入，其实可以不用的， 可以根据刚才的数组来减少插入次数 
                }else{
                    j--;
                }
            }
           // 这里发现缺失逻辑 我需要看一下current有没有el。如果没有el说明是新增的逻辑
           // 最长递增子序列来实现  vue2 在移动元素的时候会有浪费  优化
        }
    }
    const patchChildren = (n1,n2,el) =>{
        // 比较两个虚拟节点的儿子的差异 ， el就是当前的父节点
        const c1 = n1.children;
        const c2 = n2.children;
        const prevShapeFlag = n1.shapeFlag; // 之前的
        const shapeFlag = n2.shapeFlag; // 之后的
        // 文本  空的null  数组


        // 比较两个儿子列表的差异了 
        // 新的 老的
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){ 
                // 删除所有子节点
                unmountChildren(c1)  // 文本	数组	（删除老儿子，设置文本内容）
            }
            if(c1 !== c2){ // 文本	文本	（更新文本即可）  包括了文本和空
                hostSetElementText(el,c2)
            }
        }else{
            // 现在为数组或者为空
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){  // 数组	数组	（diff算法）
                    // diff算法
                    patchKeyedChildren(c1,c2,el); // 全量比对
                }else{
                    // 现在不是数组 （文本和空 删除以前的）
                    unmountChildren(c1); // 空	数组	（删除所有儿子）
                }
            }else{
                if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){ 
                    hostSetElementText(el,'')   // 数组	文本	（清空文本，进行挂载）
                }   // 空	文本	（清空文本）
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){ 
                    mountChildren(c2,el)   // 数组	文本	（清空文本，进行挂载）
                }
            }
        }
    }

    const patchElement = (n1,n2) =>{ // 先复用节点、在比较属性、在比较儿子
        let el =  n2.el = n1.el;
        let oldProps = n1.props || {}; // 对象
        let newProps = n2.props || {}; // 对象

        patchProps(oldProps,newProps,el);
        patchChildren(n1,n2,el);
    }


    const processElement = (n1,n2,container,anchor) => {
        if(n1 === null){
            mountElement(n2,container,anchor);
        }else{
            // 元素比对
           patchElement(n1,n2)
        }
    }
    const processFragment = (n1,n2,container) =>{
        if(n1 == null){
            mountChildren(n2.children,container)
        }else{
            patchChildren(n1,n2,container); // 走的是diff算法
        }   
    }
    const mountComponent = (vnode,container,anchor) =>{
        let {data=()=>({}),render} = vnode.type; // 这个就是用户写的内容
        const state = reactive(data()); // pinia 源码就是 reactive({})  作为组件的状态

        const instance = { // 组件的实例
            state,
            vnode,  // vue2的源码中组件的虚拟节点叫$vnode  渲染的内容叫_vnode
            subTree:null, // vnode组件的虚拟节点   subTree渲染的组件内容
            isMounted:false,
            update:null,
        }
        const componentUpdateFn = () =>{ // 区分是初始化 还是要更新
            if(!instance.isMounted){ // 初始化
                const subTree = render.call(state); // 作为this，后续this会改
                patch(null,subTree,container,anchor); // 创造了subTree的真实节点并且插入了
                instance.subTree = subTree;
                instance.isMounted = true
            }else{ // 组件内部更新
                const subTree = render.call(state);
                patch(instance.subTree,subTree,container,anchor);
                instance.subTree = subTree;
            }
        }
        // 组件的异步更新
        const effect = new ReactiveEffect(componentUpdateFn,()=> queueJob(instance.update))
        // 我们将组件强制更新的逻辑保存到了组件的实例上，后续可以使用
        let update = instance.update = effect.run.bind(effect); // 调用effect.run可以让组件强制重新渲染
        update();

    }
    const processComponent = (n1,n2,container,anchor) =>{ // 统一处理组件， 里面在区分是普通的还是 函数式组件
        if(n1 == null){
            mountComponent(n2,container,anchor);
        }else{  
            // 组件更新靠的是props
        }
    }
    const patch = (n1,n2,container,anchor = null) => { //  核心的patch方法
        if(n1 === n2) return;
        if(n1 && !isSameVnode(n1,n2)){ // 判断两个元素是否相同，不相同卸载在添加
            unmount(n1); // 删除老的
            n1 = null
        }
        const {type,shapeFlag} = n2
        switch(type){
            case Text:
                processText(n1,n2,container);
                break;
            case Fragment: // 无用的标签
                processFragment(n1,n2,container);
                break;
            default:
                if(shapeFlag & ShapeFlags.ELEMENT){
                    processElement(n1,n2,container,anchor);
                }else if(shapeFlag & ShapeFlags.COMPONENT){
                    // 文档只能在你会的时候看，不会的时候很难看懂
                    processComponent(n1,n2,container,anchor)
                }
        }
    }
    const unmount = (vnode) =>{
        hostRemove(vnode.el);
    }
    // vnode 虚拟dom
    const render = (vnode,container) =>{ // 渲染过程是用你传入的renderOptions来渲染
        if(vnode == null){
            // 卸载逻辑
            if(container._vnode){ // 之前确实渲染过了，那么就卸载掉dom
                unmount(container._vnode); // el
            }
        }else{
            // 这里既有初始化的逻辑，又有更新的逻辑
            patch(container._vnode || null,vnode,container)
        }
        container._vnode = vnode
        // 如果当前vnode是空的话 
    }
    return {
        render
    }
}
// 文本的处理, 需要自己增加类型。因为不能通过document.createElement('文本')
// 我们如果传入null的时候在渲染时，则是卸载逻辑，需要将dom节点删掉


// 1) 更新的逻辑思考：
// - 如果前后完全没关系，删除老的 添加新的
// - 老的和新的一样， 复用。 属性可能不一样， 在比对属性，更新属性
// - 比儿子