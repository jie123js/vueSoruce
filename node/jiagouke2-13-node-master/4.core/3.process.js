// node中的事件环  浏览器中事件环和node事件环的区别？

// process 进程

// console.log(Object.keys(process)); 
// 1.platform  2.nextTick  3.cwd  4.env  5.argv


// 可能有一种需求： 我们想写一个脚手架，需要有配置文件
console.log(process.platform); // win32 darwin, 执行命令


// cwd current working directory 当前的执行工作目录  运行打包的时候会找对应的配置文件 在当前目录下找到执行路径 
// 当前文件的路径是不能改变的，但是执行路径是可以改变的
console.log(process.cwd(),__dirname)


// 在实现一些工具的时候 需要区分环境变量  （全局环境变量，局部的环境变量）

// 环境变量中被配置到path中的路径中的可执行文件可以直接在命令行中执行
// 我们可以通过set、export语法设置临时的环境变量  
console.log(process.env.NODE_ENV)  //  cross-env 可以跨平台设置环境变量
// 通过env属性来控制不同情况下的参数


// 用户命令行交互获取用户输入的参数
console.log(process.argv.slice(2)); // 前两个参数是默认值 可执行node文件， 执行文件， 后面就是用户的参数
// --port 3000  --config   配置文件

let args = process.argv.slice(2).reduce((memo,current,index,array)=>{
    if(current.startsWith('--')){
        memo[current.slice(2)] = array[index+1] ? array[index+1].startsWith('--')? true:array[index+1]: true
    }
    return memo;
},{})
console.log(args);

// 第三方模块可以来实现这些功能 cmmonder yargs 



