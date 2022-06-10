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
  if (context.source.startsWith("</")) {
    return true;
  }
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

//getCousor 获取位置的信息 根据当前的上下文
//parseTextData 处理文本内容的,并且会根据最新位置偏移信息
//advancePositionWithMutation 更新信息
//getSelection 获取开始和结尾位置信息
//advanceBy 会进行前进删除
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

function parseInterpolation(context) {
  //处理表达式的信息 {{abc}}
  const start = getCursor(context);
  const closeIndex = context.source.indexOf("}}", 2); //查找结束的大括号

  advanceBy(context, 2); //删除{{

  const innerStart = getCursor(context);
  const innerEnd = getCursor(context); //advancePositionWithMutation 更新信息

  //拿到原始的内容   {{abc}}的closeIndex = 5   5-2=3
  const rawContentLength = closeIndex - 2; //原始内容的长度
  let preContent = parseTextData(context, rawContentLength); //可以返回文本内容,并且可以更新信息

  let content = preContent.trim(); //去空格
  let startOffset = preContent.indexOf(content); // {{  xxx}} 如果大于0说明有空格

  if (startOffset > 0) {
    advancePositionWithMutation(innerStart, preContent, startOffset);
  }
  let endOffset = startOffset + content.length;

  advancePositionWithMutation(innerEnd, preContent, endOffset);

  advanceBy(context, 2);

  return {
    type: NodeTypes.INTERPOLATION, //表达式
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
      loc: getSelection(context, innerStart, innerEnd),
    },
    loc: getSelection(context, start),
  };
}

function advanceBySpaces(context) {
  const match = /^[ \t\r\n]+/.exec(context.source);
  if (match) {
    advanceBy(context, match[0].length);
  }
}

function parseAttributeValue(context) {
  const start = getCursor(context);
  //有可能是 a=''  a=""

  let quote = context.source[0]; //看引号是单引号还是双引号还是没有
  let content;
  if (quote == '"' || quote === "'") {
    advanceBy(context, 1); //"a" 删除一个引号
    const endIndex = context.source.indexOf(quote);
    content = parseTextData(context, endIndex);
    advanceBy(context, 1);
  }
  return {
    content,
    loc: getSelection(context, start),
  };
}

function parseAttribute(context) {
  const start = getCursor(context);

  //属性的名字
  const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source);

  let name = match[0];
  //<div a = 1></div>
  advanceBy(context, name.length); //删除a

  advanceBySpaces(context); //删除空格
  advanceBy(context, 1); //删除 =

  let value = parseAttributeValue(context);

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: {
      type: NodeTypes.TEXT,
      ...value,
    },
    loc: getSelection(context, start),
  };
}

function parseAttributes(context) {
  //a=1 b=2>

  const props = [];

  while (context.source.length > 0 && !context.source.startsWith(">")) {
    const prop = parseAttribute(context);

    props.push(prop);

    advanceBySpaces(context);
  }

  return props;
}

function parseTag(context) {
  const start = getCursor(context);
  const match = /^<\/?([a-z][^ \t\r\n/>]*)/.exec(context.source); // 匹配标签名
  const tag = match[1]; //标签名
  advanceBy(context, match[0].length); //删除整个标签
  advanceBySpaces(context);

  //处理属性
  let props = parseAttributes(context);
  //<div>  <div/>

  //看看是不是自闭和标签
  //可能有属性
  let isSelfClosing = context.source.startsWith("/>");

  advanceBy(context, isSelfClosing ? 2 : 1);

  return {
    type: NodeTypes.ELEMENT,
    tag: tag,
    isSelfClosing,
    children: [],
    props,
    loc: getSelection(context, start),
  };
}

function parseElement(context) {
  //解析标签  自闭和标签<br/> <div  aa='vv></div>

  //<div></div>
  let ele = parseTag(context); //现阶段如果是<div></div> 已经删除了<div> 还剩下</div>

  //儿子
  let children = parseChildren(context); //处理儿子的时候 可能没有儿子
  if (context.source.startsWith("</")) {
    parseTag(context);
  }
  ele.loc = getSelection(context, ele.loc.start); //计算最新的位置信息
  ele.children = children;
  return ele;
}

export function parse(template) {
  //创建一个解析的上下文,来进行处理
  const context = createParseContext(template);

  //<元素
  //{{}}表达式
  //其他就是文本

  const start = getCursor(context);

  return createRoot(parseChildren(context), getSelection(context, start));

  //return parseChildren(context);
}

function createRoot(children, loc) {
  return {
    type: NodeTypes.ROOT, //Fragament
    children,
    loc,
  };
}

function parseChildren(context) {
  const nodes = [];
  while (!isEnd(context)) {
    const source = context.source;
    let node;
    if (source.startsWith("{{")) {
      node = parseInterpolation(context);
    } else if (source[0] === "<") {
      //标签
      node = parseElement(context);
    }
    //文本
    if (!node) {
      node = parseText(context);
    }
    nodes.push(node);
  }
  nodes.forEach((node, i) => {
    //去除无用空格
    if (node.type === NodeTypes.TEXT) {
      //

      if (!/[^\t\r\n\f ]/.test(node.content)) {
        nodes[i] = null;
      }
    }
  });

  return nodes.filter(Boolean);
}
