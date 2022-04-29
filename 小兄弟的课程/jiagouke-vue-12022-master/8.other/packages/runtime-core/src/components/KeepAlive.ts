import { isVnode } from "../vnode";
import { getCurrentInstance } from "../component";
import { ShapeFlags } from "@vue/shared";
import { onMounted,onUpdated } from "../apiLifecycle";

function resetShapeFlag(vnode){
    let shapeFlag = vnode.shapeFlag;
    if(shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE){
        shapeFlag-=ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
    }
    if(shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE){
        shapeFlag-= ShapeFlags.COMPONENT_KEPT_ALIVE;
    }
    vnode.shapeFlag = shapeFlag
}

export const KeepAliveImpl = {
    __isKeepAlive:true,
    props:{
        include:{}, // 要缓存的有哪些
        exclude:{}, // 哪些不要缓存  字符串 'a,b,c'  ['a','b','c']  reg
        max:{}
    },
    setup(props,{slots}){

        // My1 => My2

        const keys = new Set(); //  缓存的key
        const cache = new Map(); // 哪个key 对应的是哪个虚拟节点

        const instance = getCurrentInstance();
        let {createElement,move} = instance.ctx.renderer;
        const storageContainer = createElement('div'); // 稍后我们要把渲染好的组件移入进去

        instance.ctx.deactivate = function(vnode){
            move(vnode,storageContainer); // 移入到

            // 调用deactivate()
        }
        instance.ctx.activate = function(vnode,container,anchor){
            move(vnode,container,anchor); // 移入到
            // move(vnode,storageContainer); // 移入到

               // 调用activate()
        }
        let pendingCacheKey = null;
        // 我怎么操作dom元素
        function cacheSubTree(){
            if(pendingCacheKey){
                cache.set(pendingCacheKey,instance.subTree); // 挂载完毕后缓存当前实例对应的subTree
            }
        }
        onMounted(cacheSubTree)
        onUpdated(cacheSubTree)
        const {include,exclude,max} = props; // watch include 与exclude的关系

        let current = null;
        function pruneCacheEntry(key){
            resetShapeFlag(current);
            cache.delete(key);
            keys.delete(key);
        }

        // 本身keep-alive
        return () =>{  // keeyp-alive本身没有功能，渲染的是插槽
            // keep-alive 默认会取去slots的default属性 返回的虚拟节点的第一个
            let vnode = slots.default();

            // 看一下vnode是不是组件，只有组件才能缓存 
            // 必须是虚拟节点而且是带状态的组件
            if(!isVnode(vnode) || !(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT)){
                return vnode;
            }   
            const comp = vnode.type;
            const key = vnode.key == null ? comp : vnode.key ;


            let name = comp.name; // 组件的名字 ， 可以根据组件的名字来决定是否需要缓存

            if(name && (include && !include.split(',').includes(name)) || (exclude && exclude.split(',').includes(name))){
                return vnode;
            }


            let cacheVnode = cache.get(key); // 找有没有缓存过
            if(cacheVnode){

                vnode.component = cacheVnode.component; // 告诉复用缓存的component
                vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE; // 标识初始化的时候 不要走创建了

                keys.delete(key)
                keys.add(key)

            }else{
                keys.add(key); // 缓存key
                pendingCacheKey = key;

                if(max &&  keys.size > max){

                    // 迭代器 {next()=>{value:done}}
                    pruneCacheEntry(keys.values().next().value)
                }
            }
            vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE; // 标识这个组件稍后是假的卸载
            current = vnode;

            return vnode; // 组件 -》 组件渲染的内容

        }
    }
}

export const isKeepAlive = (vnode) => vnode.type.__isKeepAlive

