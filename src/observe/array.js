console.log(Array.prototype); //这个是数组里面的方法
console.log(Array.__proto__); //这个是ƒ () { [native code] }

let oldArrayPrototype = Array.prototype;
export let arrayMethods = Object.create(oldArrayPrototype); // 让arrayMethods 通过__proto__ 能获取到数组的方法
console.log(arrayMethods);
let methods = [
  // 只有这七个方法 可以导致数组发生变化
  "push",
  "shift",
  "pop",
  "unshift",
  "reverse",
  "sort",
  "splice",
];

methods.forEach((i) => {
  arrayMethods[i] = function () {
    console.log("数组方法重写");
  };
});
