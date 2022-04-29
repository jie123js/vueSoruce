const isObject = (val) => typeof val == 'object' && val !== null;
const isNumber = (val) => typeof val == 'number';
const isFunction = (val) => typeof val == 'function';
const isString = (val) => typeof val == 'string';
const isBoolean = (val) => typeof val == 'boolean';
const isArray = Array.isArray;
const extend = Object.assign;
// 判断属性是不是原型属性 
const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);
const hasChanged = (oldValue, value) => oldValue !== value;
const isInteger = (key) => parseInt(key) + '' === key; // '3'  arr.xxx
// +=   LET XXX = A+B
// |=   LET XXX = A | B

export { extend, hasChanged, hasOwn, isArray, isBoolean, isFunction, isInteger, isNumber, isObject, isString };
//# sourceMappingURL=shared.esm-bundler.js.map
