import { ref } from "@vue/reactivity"
import { h } from "./h";
import { Fragment } from "./vnode"

export function defineAsyncComponent(options){
    if(typeof options === 'function'){
        options = {loader:options}
    }
    // 如果已经组件出错了？ 但是真正的组件又加载出来了，要不要更新呢？
    return {
        setup(){
            const loaded = ref(false)
            const error = ref(false)
            const loading = ref(false);
            const {loader,timeout,errorComponent,delay,loadingComponent,onError} = options;

            if(delay){
                 setTimeout(()=>{
                    loading.value = true; // 应该显示loading
                },delay)
            }

            let Comp = null;

            function load(){
                return loader().catch(err=>{
                    if(onError){
                        // 这里实现了一个promise链的递归
                        return new Promise((resolve,reject)=>{
                            const retry = ()=>resolve(load());
                            const fail = ()=>reject(err);
                            onError(err,retry,fail)
                        })
                    }
                })
            }
            load().then(c=>{
                Comp = c;
                loaded.value = true
            }).catch(err=> error.value = err).finally(()=>{
                loading.value = false;
            })

            setTimeout(()=>{
                error.value = true;
            },timeout)

            return ()=>{
                if(loaded.value){ // 正确组件的渲染
                    return h(Comp);
                }else if(error.value &&errorComponent ){
                    return h(errorComponent); // 错误组件渲染
                }else if(loading.value && loadingComponent){
                    return h(loadingComponent); // 错误组件渲染
                }
                return h(Fragment,[]); // 无意义渲染
            }
        }
    }
}