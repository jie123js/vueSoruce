function EventEmitter() {
    this._events = {}//  这个定义在实例上了 只有 new EvenrEmitter
}
EventEmitter.prototype.on = function (eventName, fn) {
    if (!this._events) this._events = {};

    // 绑定的方法不叫newListener,就要触发newListener方法
    if (eventName !== 'newListener') {
        this.emit('newListener', eventName)
    }
    (this._events[eventName] || (this._events[eventName] = [])).push(fn);
}
EventEmitter.prototype.once = function (eventName, fn) {
    if (!this._events) this._events = {};
    const once = () => {
        fn()
        this.off(eventName, once)
    }
    once.l = fn; // 这个once是谁的once
    this.on(eventName, once); // 绑定事件,触发once函数后将once移除掉
}
EventEmitter.prototype.off = function (eventName, fn) {
    if (!this._events) this._events = {};
    // 可以indexOf写循环删除， filter
    let eventLists = this._events[eventName];
    if (eventLists) {
        // 将不要的函数过滤掉，返回false就不要
        // once !== eat
        this._events[eventName] = eventLists.filter(item => ((item != fn) && (item.l != fn)))
    }
}
EventEmitter.prototype.emit = function (eventName, ...args) {
    if (!this._events) this._events = {};
    let eventLists = this._events[eventName];
    if (eventLists) eventLists.forEach(fn => fn(...args))
}

module.exports = EventEmitter;