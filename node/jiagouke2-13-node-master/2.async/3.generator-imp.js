function* read() {
    let a = yield 'vue';
    console.log(a);
    let b = yield 'react';
    console.log(b);
    let c = yield 'node'
    console.log(c);
}


let regeneratorRuntime = {
    mark(gen){
        return gen;
    },
    wrap(iteratorFn){ // 调用iteratorFn函数，传入一个上下文对象
        const _context = {
            next:0,
            done:false, // 是否执行完毕
            sent:null, // 每次执行后的返回值
            stop(){
                this.done = true;
            }
        }
        return {
            next(value){ // 上一次yield的返回值是这次调用next传递的参数
                _context.sent = value;
                let v = iteratorFn(_context);
                return {value:v,done:_context.done}
            }
        }
    }
}
var _marked = /*#__PURE__*/regeneratorRuntime.mark(read);
"use strict";

function read() {
  var a, b, c;
  return regeneratorRuntime.wrap(function read$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 'vue';

        case 2:
          a = _context.sent;
          console.log(a);
          _context.next = 6;
          return 'react';

        case 6:
          b = _context.sent;
          console.log(b);
          _context.next = 10;
          return 'node';

        case 10:
          c = _context.sent;
          console.log(c);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
let it = read()
console.log(it.next())// 遇到yield就停止此时没有赋值，第一次调用next是无意义的
console.log(it.next('abc'));//  yield的返回值是调用(下次next的传递的参数), 
console.log(it.next('ccc'));//  yield的返回值是调用next的传递的参数, 
console.log(it.next('ccc'));//  yield的返回值是调用next的传递的参数, 