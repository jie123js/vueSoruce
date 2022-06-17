// 分析require的实现方法
// 1.Module.prototype.require 实际上require就是这样一个方法
// 2.Module._load 加载某个模块 返回load的执行结果 , 应该返回的是module.exports, 需要将导出的结果放到module.exports上
// 3.Module._resolveFilename这个方法可以获取文件的绝对路径， 因为稍后要读取这个文件。 会尝试添加 .js .json
// 4.去查找缓存中是否有值， 有值就是加载过了
// 5.看一下模块是不是原生的模块
// 6.如果不是原生模块 直接创建模块 new Module() id模块的路径,exports代表的是文件的导出结果默认是空对象
// 7.将刚才创建的模块缓存起来，为了下次使用的时候可以使用缓存

// > 创建一个模块 模块上有一个exports={}属性， 最终返回的是module.exports

// module.load
// 根据文件名的后缀来进行加载， 会根据不同策略来加载  Module._extenstions[后缀] = 加载方法就可以扩展了
// 读取文件的内容 fs.readFileSync(filename, 'utf8');
// module._compile 进行模块的编译
// wrapSafe 给读取到的内容包裹一个函数  ， vm.compileFunction这个方法可以包装一个函数
// __dirname = path.dirname(文件名)
// require 用的就是一个方法
// exports 就是module.exports = {}
// this = module.exports = {}
// module = 就死当前模块
// 让函数执行，执行的时候用户会手动将导出的结果放到module.exports上   module.exports = 'hello'
// 最终返回的是module.exports 所以可以拿到require的对应的结果

// global, this, module.exports, exports
// 1. module.exports = exports = {} 这里不能直接改变exports的引用不会影响module.exports
// exports = 'hello world'
// 这里最终用的是module.exports;

// 2.exports.a = 'hello world';添加属性可以影响我们的module.exports
// this = exports 所以可以在this上添加

// 3.如果写了module.exports  又写了exports 抱歉只认module.exports

// 4.我们导出的如果是一个具体的值，这个值在模块中被改写了，再次引用引用的依旧是死值，不会变

// 5.global 是全局对象，我们声明的变量不会挂载到global上 , 如果我挂载了一个global属性，模块之间是可以共享的
const path = require('path');
const fs = require('fs');
const vm = require('vm')
function Module(id) { // 这里为什么没有用类呢？
    this.id = id;
    this.exports = {}
}
Module._extenstions = {
    '.js'(module) {
        // js 是需要我们读取文件内容并且将内容包裹一个函数
        let script = fs.readFileSync(module.id, 'utf-8');
        let fn = vm.compileFunction(script, [ // 可以获得global上的属性，其他不影响
            'exports', 'require', 'module', '__filename', '__dirname'
        ], { filename: module.filename });
        let exports = module.exports; // 默认空对象
        let require = myRequire;
        let filename = module.id;
        let dirname = path.dirname(filename);

        // Reflect.apply 保证fn调用的是原型上的apply方法，等价于上面的写法
        Reflect.apply(fn, exports, [exports, require, module, filename, dirname]); // module.exports = 'hello'
    },
    '.json'(module) {
        let jsonStr = fs.readFileSync(module.id, 'utf-8');
        module.exports = JSON.parse(jsonStr)
    },
    '.ts'() { } // 添加策略
}
Module._cache = Object.create(null);
Module._resolveFilename = function (id) { // 尝试依次添加后缀先找js,找不到在找json
    const filepath = path.resolve(__dirname, id);
    if (fs.existsSync(filepath)) return filepath; // 如果写后缀了 直接看存不存在
    const exts = Object.keys(Module._extenstions);
    for (let i = 0; i < exts.length; i++) {
        let newPath = filepath + exts[i];
        if (fs.existsSync(newPath)) return newPath;
    }
    throw new Error(`Cannot find module ${id}`)
}
Module.prototype.load = function (filename) {
    let ext = path.extname(filename); // 获得到扩展名
    Module._extenstions[ext](this); // 根据扩展名加载对应的策略
}
function myRequire(id) { // 我们需要将id转换成绝对路径，并且尝试添加后缀，为了可以通过路径找到具体的文件
    const absPath = Module._resolveFilename(id)
    let existsModule = Module._cache[absPath]
    if (existsModule) return existsModule.exports
    const module = new Module(absPath); // id,exports
    Module._cache[absPath] = module;
    // 有了模块后就对此模块进行加载
    module.load(absPath); // 加载这个模块 这里要做什么事?module.exports = 文件的内容
    return module.exports; //这里目前是空对象
}

let result = require('./1.a')
console.log(result)


// result = myRequire('./a')
// result = myRequire('./a')


// 对象的加载就是读取文件，将文件的内容手动挂载到 module.exports上，因为require返回的就是 module.exports 所以可以加载到了