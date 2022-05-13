// dom属性的操作api

import { patchAttr } from "./modules/attr";
import { patchClass } from "./modules/class";
import { patchEvent } from "./modules/event";
import { patchStyle } from "./modules/style";

// null , 值
// 值   值
// 值   null
export function patchProp(el, key, prevValue, nextValue) {
  // 类名  el.className
  if (key === "class") {
    patchClass(el, nextValue);
  } else if (key === "style") {
    // 样式 el.style
    patchStyle(el, prevValue, nextValue);
  } else if (/^on[^a-z]/.test(key)) {
    //events  addEventListener
    //todo 因为vue模板解析的时候时间都是以on开头
    patchEvent(el, key, nextValue);
  } else {
    //普通属性
    patchAttr(el, key, nextValue);
  }
}
