"use strict";
 //                          it,promise.resolve,promise.reject,_next,_throw,'next',value
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg); // it.next(undefined) / it.throw
        var value = info.value;
    }
    catch (error) { reject(error); return; }
    if (info.done) {
        resolve(value);
    } else {
        // 如果没完则调用promise.then
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function () {
        var self = this, args = arguments;
        return new Promise(function (resolve, reject) { // co 返回的是一个promise
            var gen = fn.apply(self, args); // gen = it
            function _next(value) {
               
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

function read() {
    return _read.apply(this, arguments);
}

function _read() {
    _read = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var fileName, content;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8');

                    case 2:
                        fileName = _context.sent;
                        _context.next = 5;
                        return fs.readFile(path.resolve(__dirname, fileName), 'utf8');

                    case 5:
                        content = _context.sent;
                        return _context.abrupt("return", content);

                    case 7:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee);
    }));
    return _read.apply(this, arguments);
}
// 整个异步发展流程 1.纯的回调 after + out  2.promise 链式调用（基于回调）  3.generator 用起来co  4.async+ await(语法糖)