const fs = require('fs');
const path = require('path')
// 发布订阅的核心就是将订阅函数存放到数组中，稍后事情发生了 循环数组依次调用
// 不订阅也能发布 （订阅和发布之间没有任何关系） eventBus

// 观察者模式 vue2 里面 数据变化，更新模模板 （观测数据的变化，数据变化了更新视图）  watcher dep
let school = {}
let events = {
    _arr:[],
    on(callback) { // 将要订阅的函数保存起来
        this._arr.push(callback)
    },
    emit(key, value) {
        school[key] = value;
        this._arr.forEach(callback=>callback(school))
    }
}
events.on(data => {
    if (Object.keys(data).length === 2) {
        console.log(data)
    }
})
events.on(data => {
    console.log('读取一个完毕',data)
})
fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
    events.emit('age', data);
})
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
    events.emit('name', data);
})

// 发布订阅模式，可以监控到每次完成的情况，而且可以自己控制逻辑

// 发布和订阅（订阅好要做的事，稍后事情发生了就要触发）
