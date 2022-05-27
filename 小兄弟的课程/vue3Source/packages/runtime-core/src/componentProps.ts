import { reactive } from "@vue/reactivity"
import { hasOwn } from "@vue/shared"

export const initProps = (instance,rawProps)=>{ //rawProps 父组件传过来的
    const props = {}
    const attrs = {}
    //这里暂时不处理接收的属性限制,string这类的
    const options = instance.propsOptions||{}
    if(rawProps){
        for(let key in rawProps){
            const value = rawProps[key]
          if(hasOwn(options,key)) {
              props[key] = value
          }else{
              attrs[key] = value
          }
        }
    }
//这里的props不希望在子组件内部更改,但是props得是响应式的因为父组件改变,子组件是需要更新试图的
//这里应该用的是shallowReactive,但是没写这个shallowReactive暂时用reactive代替

instance.props = reactive(props)
//attrs是不需要响应式的
instance.attrs = attrs

}

export const hasPropsChanged=(prevProps={},nextProps={})=>{
    const nextKeys = Object.keys(nextProps)
    //个数不一样需要更新
    if(nextKeys.length!==Object.keys(prevProps).length){
        return true
    }
    //前后值不一样需要更新{a:{xx:xxx}}  {a:{qq:qqq}}
    for(let i =0;i<nextKeys.length;i++){
        const key = nextKeys[i]
        if(nextProps[key]!==prevProps[key]){
            return true
        }
    }
    //上面都不满足的话 表示不用更新
    return false
}

//todo 代码优化前
// export function updateProps(instance,prevProps,nextProps){
//     //看一下属性有没有变化

//     //值得变化  ,属性的个数是否发生变化
//     if(hasPropsChanged(prevProps,nextProps)){
//         for(const key in nextProps){
//             instance.props[key] = nextProps[key]
//         }
//         for(const key in prevProps){
//             if(!hasOwn(nextProps,key)){
//                 delete instance.props[key]
//             }
//         }
//     }

// }



export function updateProps(prevProps,nextProps){
    //看一下属性有没有变化

    //值得变化  ,属性的个数是否发生变化
   
        for(const key in nextProps){
            prevProps[key] = nextProps[key]
        }
        for(const key in prevProps){
            if(!hasOwn(nextProps,key)){
                delete prevProps[key]
            }
        }
    

}