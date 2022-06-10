import { ref } from "@vue/reactivity"
import { isFunction } from "@vue/shared"
import { h } from "./h"
import { Fragment } from "./vnode"


export function defineAsyncComponent(options){
    if(isFunction(options)){
        options ={loader:options}
    }
    return {
        setup(){
            
            const loaded = ref(false)
            const error = ref(false)
            const loading = ref(false)
            let Comp =null
           const {onError,loader,timeout,errorComponent,delay,loadingComponent} = options;

            function load(){
                return  loader().catch(err=>{
                    if(onError){
                        //实现了一个promise的链的递归
                        return new Promise((resolve,reject)=>{
                            const retry =()=>resolve(load())
                            const fail =()=>reject(err)
                            onError(err,retry,fail)
                        })
                    }
                })
            }


            load().then(c=>{
                Comp = c;
                loaded.value = true
            }).catch(err=>err.value=err).finally(()=>loading.value = false)
            setTimeout(()=>{
                error.value = true
            },timeout)
            
            setTimeout(() => {
                loading.value = true
            }, delay);

            return ()=>{
                if(loaded.value){
                    return h(Comp)
                }else if(error.value&&errorComponent){
                    
                    return h(errorComponent)
                }else if(loading.value&&loadingComponent){
                    return h(loadingComponent)
                }
                return h(Fragment,[])
            }
        }
    }



}






