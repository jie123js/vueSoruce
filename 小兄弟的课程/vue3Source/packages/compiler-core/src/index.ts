import { parse } from "./parse";

export function compile(template) {
  //将模板转换成抽象语法树
  const ast = parse(template); //需要将HTML语法转换成JS语法 编译原理
  return ast;
  //对ast语法树进行一些预先处理
  // transform(ast);//会生成一些信息

  // return generate(ast);//最终返回生成代码
}
