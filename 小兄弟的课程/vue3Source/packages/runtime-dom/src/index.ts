import { createRenderer } from "@vue/runtime-core";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";

const renderOptions = Object.assign(nodeOps, { patchProp }); // domAPI 属性api
console.log(renderOptions);

export function render(vnode, container) {
  console.log(vnode, container);

  createRenderer(renderOptions).render(vnode, container);
}

export * from "@vue/runtime-core";
