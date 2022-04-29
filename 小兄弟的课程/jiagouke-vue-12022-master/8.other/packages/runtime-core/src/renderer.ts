import { reactive } from "@vue/reactivity";
import { hasOwn, invokeArrayFns, isArray, isNumber, isString, PatchFlags, ShapeFlags } from "@vue/shared";
import { ReactiveEffect } from "@vue/reactivity";
import { getSequence } from "./sequence";
import { Text ,createVnode,isSameVnode,Fragment} from "./vnode";
import { queueJob } from "./scheduler";
import { hasPropsChanged, initProps, updateProps } from "./componentProps";
import { createComponentInstance, renderComponent, setupComponent } from "./component";
import { isKeepAlive } from "./components/KeepAlive";



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
        if(isString(children[i]) || isNumber(children[i])){
            let vnode = createVnode(Text,null,children[i])
            children[i] = vnode;
        }
        return children[i];
    }
    const mountChildren = (children,container,parentComponent) =>{
        for(let i = 0; i < children.length;i++){
            let child = normalize(children,i); // 处理后要进行替换，否则childrne中存放的已经是字符串
            patch(null,child,container,parentComponent)
        }
    }
    const mountElement = (vnode,container,anchor,parentComponent)=>{
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
            mountChildren(children,el,parentComponent)
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
    const unmountChildren = (children,parentComponent) =>{
        for(let i = 0; i < children.length;i++){
            unmount(children[i],parentComponent);
        }
    }
    const patchKeyedChildren = (c1,c2,el,parentComponent) =>{ // 比较两个儿子的差异

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
                    unmount(c1[i],parentComponent)
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
                unmount(oldChild,parentComponent); // 多余的删掉
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
    const patchChildren = (n1,n2,el,parentComponent) =>{
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
                unmountChildren(c1,parentComponent)  // 文本	数组	（删除老儿子，设置文本内容）
            }
            if(c1 !== c2){ // 文本	文本	（更新文本即可）  包括了文本和空
                hostSetElementText(el,c2)
            }
        }else{
            // 现在为数组或者为空
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){  // 数组	数组	（diff算法）
                    // diff算法
                    patchKeyedChildren(c1,c2,el,parentComponent); // 全量比对
                }else{
                    // 现在不是数组 （文本和空 删除以前的）
                    unmountChildren(c1,parentComponent); // 空	数组	（删除所有儿子）
                }
            }else{
                if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){ 
                    hostSetElementText(el,'')   // 数组	文本	（清空文本，进行挂载）
                }   // 空	文本	（清空文本）
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){ 
                    mountChildren(c2,el,parentComponent)   // 数组	文本	（清空文本，进行挂载）
                }
            }
        }
    }

    const patchBlockChildren = (n1,n2,parentComponent)=>{
        for(let i = 0 ; i <n2.dynamicChildren.length;i++ ){
            // 树的递归比较 ， 现在是数组的比较
            patchElement(n1.dynamicChildren[i],n2.dynamicChildren[i],parentComponent)
        }
    }
    const patchElement = (n1,n2,parentComponent) =>{ // 先复用节点、在比较属性、在比较儿子
        let el =  n2.el = n1.el;
        let oldProps = n1.props || {}; // 对象
        let newProps = n2.props || {}; // 对象
        let {patchFlag} = n2;
        if(patchFlag & PatchFlags.CLASS ){
            if(oldProps.class !== newProps.class){
             
                hostPatchProp(el,'class',null,newProps.class)
            }
            // style .. 事件
        }else{
            patchProps(oldProps,newProps,el);
        }
        // 这里的patchChildren是一个全量的diff算法

        if(n2.dynamicChildren){ // 元素之间的优化  靶向更新
            // 只比较了动态
            patchBlockChildren(n1,n2,parentComponent);
        }else{
            // h1 在这呢/
            patchChildren(n1,n2,el,parentComponent);
        }
    }


    const processElement = (n1,n2,container,anchor,parentComponent) => {
        if(n1 === null){
            mountElement(n2,container,anchor,parentComponent);
        }else{
            // 元素比对
           patchElement(n1,n2,parentComponent)
        }
    }
    const processFragment = (n1,n2,container,parentComponent) =>{
        if(n1 == null){
            mountChildren(n2.children,container,parentComponent)
        }else{
            patchChildren(n1,n2,container,parentComponent); // 走的是diff算法
        }   
    }
     const mountComponent = (vnode,container,anchor,parentComponent) =>{
        // 1) 要创造一个组件的实例
        let instance = vnode.component = createComponentInstance(vnode,parentComponent);


        if(isKeepAlive(vnode)){
           ( instance.ctx as any).renderer = {
                createElement:hostCreateElement, // 创建元素用这个方法
                move(vnode,container){ // move的vnode肯定是组件
                    hostInsert(vnode.component.subTree.el,container)
                }
            }
        }


        // 2) 给实例上赋值
        setupComponent(instance);
        // 3) 创建一个effect
        setupRenderEffect(instance,container,anchor)
    }
    const updateComponentPreRender = (instance,next)=>{
        instance.next = null; // next清空
        instance.vnode = next; // 实例上最新的虚拟节点
        updateProps(instance.props,next.props);
        Object.assign(instance.slots,next.children)  // 更新插槽
    }
    
    const setupRenderEffect = (instance,container,anchor)=>{
        const {render,vnode} = instance;
        const componentUpdateFn = () =>{ // 区分是初始化 还是要更新
            if(!instance.isMounted){ // 初始化
                let {bm,m} = instance
                if(bm){
                    invokeArrayFns(bm)
                }
                const subTree = renderComponent(instance) // 作为this，后续this会改
                patch(null,subTree,container,anchor,instance); // 创造了subTree的真实节点并且插入了
               
                instance.subTree = subTree;
                instance.isMounted = true;

                if(m){ // 一定要保证 subTree已经有了 再去调用mounted
                    invokeArrayFns(m);
                }
            }else{ // 组件内部更新
                let {next,bu,u} = instance;
                
                if(next){
                    // 更新前 我也需要拿到最新的属性来进行更新
                    updateComponentPreRender(instance,next);
                }
                if(bu){
                    invokeArrayFns(bu);
                }
                const subTree = renderComponent(instance);
                patch(instance.subTree,subTree,container,anchor,instance);
                instance.subTree = subTree;


                if(u){
                    invokeArrayFns(u);
                }
            }
        }
        // 组件的异步更新
        const effect = new ReactiveEffect(componentUpdateFn,()=> queueJob(instance.update))
        // 我们将组件强制更新的逻辑保存到了组件的实例上，后续可以使用
        let update = instance.update = effect.run.bind(effect); // 调用effect.run可以让组件强制重新渲染
        update();
    }
    const shouldUpdateComponent = (n1,n2) =>{
         const {props:prevProps,children:prevChildren} = n1;
         const {props:nextProps,children:nextChildren} = n2;
         
         if(prevChildren || nextChildren) { // 有孩子一定要更新
              return true;
         }
         if(prevProps === nextProps) return false;
         return hasPropsChanged(prevProps,nextProps)
    }
    const updateComponent = (n1,n2) =>{
        // instance.props 是响应式的，而且可以更改  属性的更新会导致页面重新渲染
        const instance = (n2.component = n1.component); // 对于元素而言，复用的是dom节点，对于组件来说复用的是实例
        
        // 需要更新就强制调用组件的update方法
        if(shouldUpdateComponent(n1,n2)){
            instance.next = n2;// 将新的虚拟节点放到next属性上
            instance.update(); // 统一调用update方法来更新
        }


        // updateProps(instance,prevProps,nextProps); // 属性更新

    }   
    const processComponent = (n1,n2,container,anchor,parentComponent) =>{ // 统一处理组件， 里面在区分是普通的还是 函数式组件
        if(n1 == null){ // my1-> my2 -> my1
            if(n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE){
                parentComponent.ctx.activate(n2,container,anchor)
            }else{
                mountComponent(n2,container,anchor,parentComponent);
            }
        }else{  
            // 组件更新靠的是props
            updateComponent(n1,n2)
        }
    }
    const patch = (n1,n2,container,anchor = null,parentComponent = null) => { //  核心的patch方法
        if(n1 === n2) return;
        if(n1 && !isSameVnode(n1,n2)){ // 判断两个元素是否相同，不相同卸载在添加
            unmount(n1,parentComponent); // 删除老的
            n1 = null
        }
        const {type,shapeFlag} = n2
        switch(type){
            case Text:
                processText(n1,n2,container);
                break;
            case Fragment: // 无用的标签
                processFragment(n1,n2,container,parentComponent);
                break;
            default:
                if(shapeFlag & ShapeFlags.ELEMENT){
                    processElement(n1,n2,container,anchor,parentComponent);
                }else if(shapeFlag & ShapeFlags.COMPONENT){
                    // 文档只能在你会的时候看，不会的时候很难看懂
                    processComponent(n1,n2,container,anchor,parentComponent)
                }else if(shapeFlag & ShapeFlags.TELEPORT){
                    type.process(n1,n2,container,anchor,{
                        mountChildren,
                        patchChildren,
                        move(vnode,container){
                            hostInsert(vnode.component ? vnode.component.subTree.el : vnode.el,container)
                        }
                        // ...
                    })
                }
        }
    }
    const unmount = (vnode,parentComponent) =>{
        if(vnode.type == Fragment){ // fragment删除的时候 要清空儿子 不是删除真实dom
            return unmountChildren(vnode,parentComponent)
        }else if(vnode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE){
            return parentComponent.ctx.deactivate(vnode); // 直接把虚拟节点传递给你
        }else if(vnode.shapeFlag & ShapeFlags.COMPONENT){
            return unmount(vnode.component.subTree,null)
        }
        hostRemove(vnode.el); // el.removeChild()
    }
    // vnode 虚拟dom
    const render = (vnode,container) =>{ // 渲染过程是用你传入的renderOptions来渲染
        if(vnode == null){
            // 卸载逻辑
            if(container._vnode){ // 之前确实渲染过了，那么就卸载掉dom
                unmount(container._vnode,null); // el
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