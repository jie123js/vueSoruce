import { generate } from "./generate";
import { parse } from "./parse";
import { transform } from "./transform";


export function compile(template){
    // 将模板转成抽象语法树
    const ast = parse(template); // 这里需要将html语法转换成js语法  编译原理

    // codegen 为了生成代码的时候更方便 在转化过程中会生成这样一个属性
    // 这里转化 要进行收集所需的方法 createElementVnode  toDisplayString  
    // 这里需要在生成代码之前，在做一些转化  <div>{{aa}} 123</div>  createElementVnode('div',toDisplayString(aa) + 123))


    // 元素、属性、表达式、文本
    transform(ast);

    // 对ast语法树进行一些预先处理 
    // transform(ast); // 会生成一些信息
    // // 代码生成
    return generate(ast); // 最终生成代码  和vue的过程一样

}
