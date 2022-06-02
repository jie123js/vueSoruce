export const enum NodeTypes {
  ROOT, // 根节点 Fragment
  ELEMENT, // 元素
  TEXT, // 文本
  COMMENT, // 注释
  SIMPLE_EXPRESSION, // 表达式的值  简单表达式 aaa
  INTERPOLATION, // 插值  模板表达式{{aaa}}
  ATTRIBUTE, // 属性
  DIRECTIVE, // 指令
  // containers
  COMPOUND_EXPRESSION, // 复合表达式
  IF,
  IF_BRANCH,
  FOR,
  TEXT_CALL,
}
