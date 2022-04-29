import { NodeTypes } from "../ast"

export function transformText(node,context){ // 我期望 将多个子节点拼接在一起 
    // 你是不是文本
    // 需要遇到元素的时候 才能处理 多个子节点  
    if(node.type === NodeTypes.ELEMENT || node.type === NodeTypes.ROOT){
        return () =>{
        }
    }
}

// codegen (周日 pinia的实现原理 vue-router实现原理)


// 手写一个keep-alive provide / inject  teleport suspense 


// ts -> 


// ts + vite + pinia 

