import { isObject } from "@vue/shared";
import { setActivePinia } from './rootStore'
import { computed, effectScope, getCurrentInstance, inject, isRef, reactive,toRefs, watch } from "vue";
import { triggerSubscription,addSubscription } from "./pubSub";
import { activePinia, SymbolPinia } from "./rootStore";



function mergeReactiveObject(target,partialState){ // 递归
    for(let key in partialState){
        if(!partialState.hasOwnProperty(key)) continue; // 如果是原型上的不考虑
        const oldValue= target[key];
        const newValue = partialState[key];
        // 状态有可能是ref  ref也是一个对象不能递归 
        if(isObject(oldValue) && isObject(newValue)&& isRef(newValue)){
            target[key]  = mergeReactiveObject(oldValue,newValue)
        }else{
            target[key] = newValue;
        }
    }
    return target
}

export function defineStore(idOrOptions,setup){
    let id;
    let options;

    if(typeof idOrOptions === 'string'){
        id = idOrOptions;
        options = setup
    }else{
        options = idOrOptions;
        id = idOrOptions.id;
    }
    const isSetupStore = typeof setup === 'function' // 如果是函数 说明是一个setup语法

    function useStore(){
        const currentInstance = getCurrentInstance();

        // 注册了一个store
        let pinia = currentInstance && inject(SymbolPinia)
        

        if(pinia) setActivePinia(pinia);
        pinia = activePinia

        if(!pinia._s.has(id)){
            // 创建store  store = reactive({})
            //           counter , {state,getters,actions}

            if(isSetupStore){
                createSetupStore(id,setup,pinia);
            }else{
                createOptionsStore(id,options,pinia)
            }
        }
        const store = pinia._s.get(id);

        return store;
    }
    return useStore;

}

function createSetupStore(id,setup,pinia){
    
    let scope;
    // _e 能停止所有的store
    // 每个store还能停止自己的
    const setupStore = pinia._e.run(()=>{
        scope = effectScope();
        return scope.run(()=> setup())
    });
    function wrapAction(name,action){
        return function(){
            // 触发action的时候 可以触发一些额外的逻辑
            const afterCallbackList = [];
            const onErrorCallbackList = [];
            function after(callback){
                afterCallbackList.push(callback)
            }
            function onError(callback){
                onErrorCallbackList.push(callback)
            }
            triggerSubscription(actionSubscribes,{after,onError,store,name}); // 触发action 给你传递两个参数

            let ret 
            try{
                ret = action.apply(store,arguments);  // 直接出错 
            }catch(error){
                triggerSubscription(onErrorCallbackList,error)
            }
            if(ret instanceof Promise){
                return ret.then((value)=>{
                    triggerSubscription(afterCallbackList,value)
                }).catch(error=>{
                    triggerSubscription(onErrorCallbackList,error);
                    return Promise.reject(error)
                })
            }else{
                triggerSubscription(afterCallbackList,ret)
            }
            // 返回值也可以做处理
            return ret;
        }
    }
    for(let key in setupStore){
        const prop = setupStore[key]; // 拿到对应的值
        if(typeof prop === 'function'){
            setupStore[key] = wrapAction(key,prop); // 对action可以进行扩展 aop思想
        }
    }
    function $patch(partialStateOrMutation){
        if(typeof partialStateOrMutation === 'function'){ // 这个方法一般用的比较少
            partialStateOrMutation(store);
        }else{
            
            mergeReactiveObject(store,partialStateOrMutation);
        }
    }
    // 当用户状态变化的时候 可以监控到变化 并且通知用户 发布订阅
    let actionSubscribes = []
    const partialStore = {
        $patch,
        $subscribe(callback,options){  // watch
            scope.run(()=> watch(pinia.state.value[id],state=>{ // 监控状态变化
                callback({type:'dirct'},state);
            },options))
        },
        $onAction:addSubscription.bind(null,actionSubscribes),
        $dispose:()=>{
            scope.stop();
            actionSubscribes = [];
            pinia._s.delete(id); // 删除store, 数据变化了不会在更新视图
        }
    }
    const store = reactive(partialStore); // 每一个store都是一个响应式对象
    
    Object.defineProperty(store,'$state',{
        get:()=> pinia.state.value[id], // 只要状态
        set:(state)=> $patch($state=> Object.assign($state,state))
    })

    // 最终会将处理好的setupStore 放到store的身上
    Object.assign(store,setupStore);  // reactive 中放ref 会被拆包  store.count.value

    // 每个store 都会应用一下插件
    pinia._p.forEach(plugin=>Object.assign(store,plugin({store,pinia,app:pinia._a,id})))

    pinia._s.set(id,store);
    return store;
}
function createOptionsStore(id,options,pinia){
    let {state,getters,actions} = options;
    function setup(){
        // ref放入的是对象 会被自动proxy
        pinia.state.value[id] = state ? state() : {};
        const localState = toRefs(pinia.state.value[id])
        return Object.assign(
            localState,
            actions,
            Object.keys(getters || {}).reduce((computedGetters,name)=>{
                computedGetters[name] = computed(()=>{ // 计算属性有缓存的性质
                    // 我们需要获取当前的store是谁
                   return getters[name].call(store,store)
                });
                return computedGetters
            },{})

        )// 这个地方的状态还要扩展
    }
    const store = createSetupStore(id,setup,pinia);
    store.$reset = function(){ // 重置所有状态  reset 不能在setupStore中使用? 
        const newState = state ? state() :{};
        store.$patch(($state)=>{
            Object.assign($state,newState);
        })
    }
    return store;
}

// 建议一般不用高级语法的话，可以直接写成对象格式 更符合类似于vuex的写法


// $patch() $reset() $subscribe() $onAction() $dispose()
// store.$state
// 持久化插件可能会用到  我们把数据存到了localStorage中，刷新加载，需要用localStorage中的数据，去替换