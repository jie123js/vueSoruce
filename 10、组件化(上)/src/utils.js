import { lifeCycleMixin } from "./lifecycle";

export function isFunction(val) {
  return typeof val === "function";
}
export function isObject(val) {
  return typeof val == "object" && val !== null;
}

export function isArray(val) {
  return Array.isArray(val);
}
let callbacks = [];
let waiting = false;
function flushCallback() {
  callbacks.forEach((fn) => fn());
  callbacks = [];
  waiting = false;
}
//如果多次调用这个方法 会创建好多个promise显然没这个必要
export function nextTick(fn) {
  //这个是最简单的实现异步的方法 vue3就是这样写的
  callbacks.push(fn);
  if (!waiting) {
    //这里面我们的目的是放函数进来的 但是 callbacks.forEach((fn) => fn())不是一个函数  then的第一个参数需要一个函数
    Promise.resolve().then(flushCallback);
    waiting = true;
  }
  return;
}

let strats = {}; //存放所有策略

let lifeCycle = ["beforeCreate", "created", "beforeMount", "mounted"];
lifeCycle.forEach((hook) => {
  strats[hook] = function (parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        //父子都有值 父一定是数组
        return parentVal.concat(childVal);
      } else {
        if (isArray(childVal)) {
          return childVal;
        } else {
          return [childVal]; //如果没值就变成数组
        }
      }
    } else {
      //目前遇不到儿子没值
      return parentVal;
    }
  };
});

strats.components = function(parentVal,childVal){
 //创建一个新的 防止冗余,继承父
 //{}.__proto__ = parentVal
  let res = Object.create(parentVal)
  if(childVal){
    for(let key in childVal){
      res[key] = childVal[key]
    }
  }
  return res
}


//todo 这是我们要合成的结果
//{} {beforecreate:fn}  => {beforecreate:[fn]}
//{beforecreate:[fn]} {beforecreate:fn} =>{beforecreate:[fn,fn]}
export function mergeOption(parentVal, childVal) {
  // console.log(parentVal, childVal);
  const options = {};
  //循环2个对象的key
  for (let key in parentVal) {
    mergeFiled(key);
  }
  for (let key in childVal) {
    //如果父亲已经有了这个key儿子就不需要再把有的key放进去了
    if (!parentVal.hasOwnProperty(key)) {
      mergeFiled(key);
    }
  }
  function mergeFiled(key) {
    let strat = strats[key];

    //设计模式 策略模式
    if (strat) {
      options[key] = strat(parentVal[key], childVal[key]);
    } else {
      //合并取值相同key都取儿子优先
      options[key] = childVal[key] || parentVal[key];
    }
  }
  return options;
}

// let a = mergeOption({ a: 1, b: 2 }, { c: 2, b: 3 });
// console.log(a);

function makeMap(str){
  let tagList = str.split(',');
  return function(tagName){
      return tagList.includes(tagName)
  }
}

export const isReservedTag = makeMap(
  'template,script,style,element,content,slot,link,meta,svg,view,button,' +
  'a,div,img,image,text,span,input,switch,textarea,spinner,select,' +
  'slider,slider-neighbor,indicator,canvas,' +
  'list,cell,header,loading,loading-indicator,refresh,scrollable,scroller,' +
  'video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown'
)

