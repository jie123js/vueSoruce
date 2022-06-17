const request = require("./request");

const context = {}

function defineGetter(proto, target, key) {
    proto.__defineGetter__(key, function () {
        return this[target][key];
    })
}

function defineSetter(proto, target, key) {
    proto.__defineSetter__(key, function (value) { // 代理了
        this[target][key] = value
    })
}
defineGetter(context, 'request', 'url');
defineGetter(context, 'request', 'path');
defineGetter(context, 'request', 'method');
defineGetter(context, 'response', 'body');

defineSetter(context, 'response', 'body');

// 这里我们希望能不能少写点代码


module.exports = context