import { currentInstance } from "./component";

// provides: parent ? parent.provides : Object.create(null)

//  // parent :  {state:'xxx'}  -> child :  {state:'xxx'} -> grandson : {}
export function provide(key,value){
    if(!currentInstance) return; // 此proivide 一定要用到setup语法中
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;

    let provides = currentInstance.provides; // 自己的provides
    // 自己的provides 不能定义在父亲上，否则会导致儿子提供的属性 父亲也能用
    if(parentProvides === provides){ // 此时只有第一次provide 相同，第二次是不同的
        // 原型查找
        provides = currentInstance.provides = Object.create(provides)
    }
    provides[key] = value;
}
export function inject(key,defaultValue){ // 只是查找
    if(!currentInstance) return; // 此inject 一定要用到setup语法中
    const provides = currentInstance.parent && currentInstance.parent.provides;
    if(provides && (key in provides)){ // 通过父亲的proivides 将属性返回
        return provides[key];
    }else if(arguments.length > 1){
        return defaultValue
    }
}