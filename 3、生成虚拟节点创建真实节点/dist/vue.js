(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function isFunction(val) {
    return typeof val === "function";
  }
  function isObject(val) {
    return typeof val == "object" && val !== null;
  }
  function isArray(val) {
    return Array.isArray(val);
  }

  // console.log(Array.prototype); //这个是数组里面的方法
  // console.log(Array.__proto__); //这个是ƒ () { [native code] }
  let oldArrayPrototype = Array.prototype;
  let arrayMethods = Object.create(oldArrayPrototype); // 让arrayMethods 通过__proto__ 能获取到数组的方法

  let methods = [// 只有这七个方法 可以导致数组发生变化
  "push", "shift", "pop", "unshift", "reverse", "sort", "splice"];
  methods.forEach(i => {
    arrayMethods[i] = function (...args) {
      oldArrayPrototype[i].call(this, ...args);
      console.log("数组方法重写");
      let insert = [];

      switch (i) {
        case "splice":
          insert = args.slice(2);
          break;

        case "push":
        case "unshift":
          insert = args;
          break;
      } //这里添加了 但是数组里面如果有对象还是需要劫持的  想到index.js有一个劫持数组的方法


      if (insert) this._ob_.observeArray(insert);
    };
  });

  class Observe {
    constructor(value) {
      Object.defineProperty(value, "_ob_", {
        value: this,
        enumerable: false // 标识这个属性不能被列举出来，不能被循环到

      });

      if (isArray(value)) {
        // 不让__ob__ 被遍历到
        //value.__ob__ = this; // 我给对象和数组添加一个自定义属性(这样设置的话,会走进observe的逻辑无线递归)
        value.__proto__ = arrayMethods;
        this.observeArray(value); //是让数组里面假如有对象再进行一步监听
      } else {
        this.walk(value);
      }
    }

    observeArray(data) {
      // 递归遍历数组，对数组内部的对象再次重写 [[]]  [{}]
      // vm.arr[0].a = 100;
      // vm.arr[0] = 100;
      data.forEach(item => observe(item)); // 数组里面如果是引用类型那么是响应式的
    }

    walk(data) {
      //todo 循环对象的key且不要原型上面的key
      Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key]);
      });
    }

  }

  function defineReactive(obj, key, value) {
    //todo data里面嵌套对象的话递归调用(这个是vue2性能差的一个原因)
    observe(value); //todo 这是一个闭包这个value不能被销毁

    Object.defineProperty(obj, key, {
      get() {
        return value;
      },

      set(newValue) {
        console.log("我被处罚");
        observe(newValue); //如果新的值是一个新对象也需要劫持

        if (newValue = value) {
          return;
        }

        value = newValue;
      }

    });
  }

  function observe(value) {
    //console.log(value);
    //   if(!isObject(value){
    //       return
    //   }
    if (!isObject(value)) {
      return;
    }

    if (value._ob_) {
      return;
    }

    return new Observe(value);
  }

  function initState(vm) {
    const opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function proxy(vm, key, source) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key];
      },

      set(newValue) {
        vm[source][key] = newValue;
      }

    });
  }

  function initData(vm) {
    //console.log("初始化vm");
    let data = vm.$options.data; //如果data写的是函数this指向是window所以我们需要用call重置(对call的一个理解call里面如果写个this当第一个参数,意思就是谁调用他就谁当this,不改变原来执行的this)
    //例子 arr.push.call(this) 那这个就是正常执行push方法原来的this其实arr 这样写的好处是可以加多个参数因为call第二个参数可以是数组 arr.push.call(this,...args)

    data = vm._data = isFunction(data) ? data.call(vm) : data; //为什么不能直接用vm.$options.data而是要再整一个_data因为如果data是函数的话,堆地址就变了 就不是同一个了
    // console.log(data === vm.$options.data);  如果data是对象的话 是一样的 但是函数的话就没有get set劫持了 因为指的不是一个堆地址

    observe(data); //! 这一步是为了让外面的vm可以直接通过vm.xxx获取数据做了一层代理
    //? 我发现不用这个vm._data 好像也可以直接把data传过去一样的 都是一个代理空间  但是这里可能是为了让vm上面挂一个_data数据

    for (let key in data) {
      proxy(vm, key, "_data");
    } //? 被观测后的逻辑都可以在这调试
    //console.log(data);
    //data.a.c.push(1); 看看有没有重置成功

  }

  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{   xxx  }}  

  function genProps(attrs) {
    // {key:value,key:value,}
    let str = '';

    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i];

      if (attr.name === 'style') {
        // {name:id,value:'app'}
        let styles = {};
        attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
          styles[arguments[1]] = arguments[2];
        });
        attr.value = styles;
      }

      str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }

    return `{${str.slice(0, -1)}}`;
  }

  function gen(el) {
    if (el.type == 1) {
      return generate(el); // 如果是元素就递归的生成
    } else {
      let text = el.text; // {{}}

      if (!defaultTagRE.test(text)) return `_v('${text}')`; // 说明就是普通文本
      // 说明有表达式 我需要 做一个表达式和普通值的拼接 ['aaaa',_s(name),'bbb'].join('+)
      // _v('aaaa'+_s(name) + 'bbb')

      let lastIndex = defaultTagRE.lastIndex = 0;
      let tokens = []; // <div> aaa{{bbb}} aaa </div>

      let match; // ，每次匹配的时候 lastIndex 会自动向后移动

      while (match = defaultTagRE.exec(text)) {
        // 如果正则 + g 配合exec 就会有一个问题 lastIndex的问题
        let index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return `_v(${tokens.join('+')})`; // webpack 源码 css-loader  图片处理
    }
  }

  function genChildren(el) {
    let children = el.children;

    if (children) {
      return children.map(item => gen(item)).join(',');
    }

    return false;
  } // _c(div,{},c1,c2,c3,c4)


  function generate(ast) {
    let children = genChildren(ast);
    let code = `_c('${ast.tag}',${ast.attrs.length ? genProps(ast.attrs) : 'undefined'}${children ? `,${children}` : ''})`;
    return code;
  }

  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 匹配标签名的  aa-xxx

  const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  aa:aa-xxx  

  const startTagOpen = new RegExp(`^<${qnameCapture}`); //  此正则可以匹配到标签名 匹配到结果的第一个(索引第一个) [1]

  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>  [1]

  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
  // [1]属性的key   [3] || [4] ||[5] 属性的值  a=1  a='1'  a=""

  const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  />    > 
  // vue3的编译原理比vue2里好很多，没有这么多正则了

  function parserHTML(html) {
    // 可以不停的截取模板，直到把模板全部解析完毕 
    let stack = [];
    let root = null; // 我要构建父子关系  

    function createASTElement(tag, attrs, parent = null) {
      return {
        tag,
        type: 1,
        // 元素
        children: [],
        parent,
        attrs
      };
    }

    function start(tag, attrs) {
      // [div,p]
      // 遇到开始标签 就取栈中的最后一个作为父节点
      let parent = stack[stack.length - 1];
      let element = createASTElement(tag, attrs, parent);

      if (root == null) {
        // 说明当前节点就是根节点
        root = element;
      }

      if (parent) {
        element.parent = parent; // 跟新p的parent属性 指向parent

        parent.children.push(element);
      }

      stack.push(element);
    }

    function end(tagName) {
      let endTag = stack.pop();

      if (endTag.tag != tagName) {
        console.log('标签出错');
      }
    }

    function text(chars) {
      let parent = stack[stack.length - 1];
      chars = chars.replace(/\s/g, "");

      if (chars) {
        parent.children.push({
          type: 2,
          text: chars
        });
      }
    }

    function advance(len) {
      html = html.substring(len);
    }

    function parseStartTag() {
      const start = html.match(startTagOpen); // 4.30 继续

      if (start) {
        const match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        let end;
        let attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 1要有属性 2，不能为开始的结束标签 <div>
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        } // <div id="app" a=1 b=2 >


        if (end) {
          advance(end[0].length);
        }

        return match;
      }

      return false;
    }

    while (html) {
      // 解析标签和文本   
      let index = html.indexOf('<');

      if (index == 0) {
        // 解析开始标签 并且把属性也解析出来  </div>
        const startTagMatch = parseStartTag();

        if (startTagMatch) {
          // 开始标签
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        let endTagMatch;

        if (endTagMatch = html.match(endTag)) {
          // 结束标签
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }
      } // 文本


      if (index > 0) {
        // 文本
        let chars = html.substring(0, index); //<div></div>

        text(chars);
        advance(chars.length);
      }
    }

    return root;
  } //  <div id="app">hello wolrd <span>hello</span></div> */}

  function compileToFunction(template) {
    // 1.将模板变成ast语法树
    let ast = parserHTML(template); // 代码优化 标记静态节点
    // 2.代码生成

    let code = generate(ast); //模板引擎的实现原理基本都是new Function + with

    console.log(code);
    let render = new Function(`with(this){return ${code}}`);
    console.log(render.toString());
    console.log(render);
    return render; // 1.编译原理
    // 2.响应式原理 依赖收集
    // 3.组件化开发 （贯穿了vue的流程）
    // 4.diff算法
  }

  function patch(el, vnode) {
    //删除老节点 根据vnode创建新节点,替换掉老节点
    //我们需要先把新节点创建到老节点后面,然后再删除掉老节点
    const elm = createEle(vnode);
    console.log(elm); //   把虚拟节点插入当前页面元素的下一个元素前面
    //el.nextSibling//当前元素的下一个元素

    const parentNode = el.parentNode;
    parentNode.insertBefore(elm, el.nextSibling); //el.nextSibling如果不存在就是null,那就相当于appendChild所以需要用 el.parentNode的父亲节点

    parentNode.removeChild(el);
  } //面试有问 虚拟节点的实现 和虚拟节点渲染成真实节点

  function createEle(vnode) {
    //判断一下tag是什么类型 要么就是div这种类型要么就是文本(之后会添加其他类型)
    //我们让虚拟节点和真实节点做一个映射关系 为什么那  后续某个虚拟节点更新了,我们可以跟踪到真实节点,并且更新真实节点
    let {
      tag,
      data,
      text,
      children,
      vm
    } = vnode;

    if (typeof tag === "string") {
      vnode.el = document.createElement(tag);
      updateProperties(vnode.el, data);
      children.forEach(child => {
        vnode.el.appendChild(createEle(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    console.log(vnode);
    return vnode.el;
  }

  function updateProperties(el, props = {}) {
    //后续diff算法的时候再完善,先不考虑class等
    console.log(props);

    for (let key in props) {
      el.setAttribute(key, props[key]);
    }

    console.log(el);
  }

  function mountComponent(vm) {
    //调用render()  但是这个方法可能每个人都要用,可以封装一下
    let vnode = vm._render(); //拿到虚拟节点,然后去变成真实节点


    vm._updata(vnode);
  }
  function lifeCycleMixin(Vue) {
    Vue.prototype._updata = function (vnode) {
      //采用的是 先深度遍历 创建节点 (遇到节点就创建节点,递归创建)
      const vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  }

  function _initMax(Vue) {
    Vue.prototype._init = function (options) {
      const vm = this; //console.log(this);//todo实例对象

      vm.$options = options;
      initState(vm); //初始化

      if (vm.$options.el) {
        // 要将数据挂载到页面上
        // 现在数据已经被劫持了， 数据变化需要更新视图 diff算法更新需要更新的部分
        // vue -> template（写起来更符合直觉） -> jsx （灵活）
        // vue3 template 写起来性能会更高一些 内部做了很多优化
        // template -> ast语法树（用来描述语法的，描述语法本身的） -> 描述成一个树结构 ->  将代码重组成js语法
        // 模板编译原理 （把template模板编译成render函数-》 虚拟DOM -》 diff算法比对虚拟DOM）
        // ast -> render返回 -> vnode -> 生成真实dom
        //      更新的时候再次调用render -> 新的vnode  -> 新旧比对 -> 更新真实dom
        vm.$mount(vm.$options.el);
      }
    }; // new Vue({el}) new Vue().$mount


    Vue.prototype.$mount = function (el) {
      const vm = this;
      const opts = vm.$options;
      el = document.querySelector(el); // 获取真实的元素

      vm.$el = el; // 页面真实元素

      if (!opts.render) {
        // 模板编译
        let template = opts.template;

        if (!template) {
          template = el.outerHTML;
        } //就模板变成render函数


        let render = compileToFunction(template);
        opts.render = render;
      } //这里已经获取到了一个render函数,这个函数的返回值大概就是


      mountComponent(vm);
    };
  }

  //接受的是实例vm 标签 属性(属性有可能为空) 孩子(这里用了...children  就是接受剩余的参数 这里children是一个数组)
  function createElement(vm, tag, data = {}, ...children) {
    //返回虚拟节点
    return vnode(vm, tag, data, children, data.key, undefined); //元素是没有文本的所有是undefined
  }
  function createText(vm, text) {
    //返回虚拟节点
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, data, children, key, text) {
    return {
      vm,
      tag,
      data,
      children,
      key,
      text
    };
  } //vnode就是一个对象 用来描述节点的  和AST很像啊?
  // ast 描述语法,没有自己的逻辑,只看语法解析的内容
  //vnode 是描述dom结构的 可以去扩展属性

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      //创建元素节点
      const vm = this;
      console.log(arguments);
      return createElement(vm, ...arguments);
    };

    Vue.prototype._v = function (text) {
      //创建文本节点
      console.log(arguments);
      const vm = this;
      return createText(vm, text); //描述虚拟节点属于哪个实例
    };

    Vue.prototype._s = function (val) {
      //JSON.stingify()  本身没意义 只是要把对象转出字符串
      if (isObject(val)) {
        return JSON.stringify(val);
      } else {
        return val;
      }
    };

    Vue.prototype._render = function () {
      const vm = this; //这里this就是实例

      let {
        render
      } = vm.$options;
      let vnode = render.call(vm); //然后这里面执行的时候里面的函数都是在类里面的函数c,v,s都会从原型上找到执行
      //这里为什么可以用vm但是vm里面的取值明明还有一层才可以取到(和test.js相比较)因为我们之前做了代理我们访问vm.name其实是代理到了vm._data.name

      console.log(vnode);
      return vnode;
    };
  }
  /* function anonymous(
      ) {
      with(this){return _c('div',{id:"app"},_v("aaa"+_s(name)+"bbb"+_s(age)+"ccc"))}


      什么的执行过程 
      _s执行参数是_data里面有的name  kobe
      _s是11
      _v是aaaundefinedbbbundefinedccc 因为_s没有返回值是undefined
      _c执行的参数是 3个参数 第一个是div 第二个是{id:app }  第三是undefined


      但是后面如果补充完整_s _v _c函数的返回值那就不会出现上面的undefined的情况了
      } */

  function Vue(options) {
    this._init(options);
  }

  _initMax(Vue);

  renderMixin(Vue);
  lifeCycleMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
