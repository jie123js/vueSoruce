const Application = require('./application');
// 每次调用函数都产生一个应用的实例   工厂模式
function createApplication() {
    return new Application
}
// express = createApplication



createApplication.Router = require('./router')
module.exports = createApplication



// 核心就是创建应用