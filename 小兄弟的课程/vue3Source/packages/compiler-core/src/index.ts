import { NodeTypes } from "./ast";

function createParseContext(template) {
  return {
    line: 1,
    colum: 1,
    offset: 0,
    source: template, //此字段会被不停的进行解析 slice
    originalSource: template,
  };
}

function isEnd(context) {
  const source = context.source;
  return !source; //如果解析完毕后为空字符串表示解析完毕
}

function getCursor(context) {
  let { line, colum, offset } = context;
  return { line, colum, offset };
}

function advancePositionWithMutation(context, source, endIndex) {
  let linesCount = 0;

  let linePos = -1; //记录换行的第一个字母

  for (let i = 0; i < endIndex; i++) {
    if (source.charCodeAt(i) == 10) {
      //回车是3  换行是10
      linesCount++;
      linePos = i;
    }
  }
  context.line += linesCount;
  context.offset += endIndex;

  //第一种没有换行  123456
  //换行后    123345
  //        todo45666  这种偏移量就是末尾减去换行的第一个元素的index,偏移量就是todo文字区域

  context.colum =
    linePos === -1 ? context.colum + endIndex : endIndex - linePos;
}

function advanceBy(context, endIndex) {
  //每次删除内容的时候 都要更新最新的行列和偏移量信息
  let source = context.source;
  advancePositionWithMutation(context, source, endIndex);

  context.source = context.source.slice(endIndex);
}

function parseTextData(context, endIndex) {
  const rawText = context.source.slice(0, endIndex);
  //把取出的值删除
  advanceBy(context, endIndex);
  console.log(rawText);

  return rawText;
}

function getSelection(context, start, end?) {
  end = end || getCursor(context);
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset),
  };
}

function parseText(context) {
  //在解析文本的时候要看后面到哪里结束  'abc<div></div>{{data}}'
  let endTokens = ["<", "{{"];

  //todo 用假设法 默认最后一个是结束
  let endIndex = context.source.length;

  for (let i = 0; i < endTokens.length; i++) {
    let index = context.source.indexOf(endTokens[i], 1);

    if (index !== -1 && endIndex > index) {
      //存在且index小于文本长度)
      endIndex = index;
    }
  }

  //创建行列信息
  const start = getCursor(context); //开始

  //取内容
  const content = parseTextData(context, endIndex);
  return {
    type: NodeTypes.TEXT,
    content: content,
    loc: getSelection(context, start),
  };
}

function parse(template) {
  //创建一个解析的上下文,来进行处理
  const context = createParseContext(template);

  //<元素
  //{{}}表达式
  //其他就是文本

  const nodes = [];
  while (!isEnd(context)) {
    const source = context.source;
    let node;
    if (source.startsWith("{{")) {
      node = "xx";
    } else if (source[0] === "<") {
      //标签
      node = "qq";
    }
    //文本
    if (!node) {
      node = parseText(context);
    }
    nodes.push(node);
    console.log(nodes);

    break;
  }
}

export function compile(template) {
  //将模板转换成抽象语法树
  const ast = parse(template); //需要将HTML语法转换成JS语法 编译原理
  return ast;
  //对ast语法树进行一些预先处理
  // transform(ast);//会生成一些信息

  // return generate(ast);//最终返回生成代码
}
