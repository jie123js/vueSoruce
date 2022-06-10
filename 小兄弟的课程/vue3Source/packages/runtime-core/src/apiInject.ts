// provide:parent?parent.provide:Object.create(null),//所有的组件用的就是父亲的provide

import { currentInstance } from "./components";

export function provide(key,value){
     if(!currentInstance) return  //这个API一定要用在setup语法中

     let provides = currentInstance.provides //自己的provide

     //自己的provide 不能定义在父亲上,因为是引用地址,需要拷贝一份
    //这样写的话会浪费性能 每次都创建一个新的 所以做一个判断,只有第一次的时候才创建,第一次的时候自己和父亲的provide相等

    const parentProvides = currentInstance.parent&&currentInstance.parent.provides
    if(provides===parentProvides){
        provides = currentInstance.provides =  Object.create(provide)
    }
     

    provides[key] = value

}

export function inject(key,defaultValue){
    if(!currentInstance) return  //这个API一定要用在setup语法中
    const provides = currentInstance.parent && currentInstance.parent.provides;
    if(provides&&(key in provides)){ //通过父亲的provides 将属性返回  通过原型链查找 Object.create可以复制原型链  for in可以查找到原型的属性
        return provides[key]
    }else if(arguments.length>1){
        return defaultValue
    }
}