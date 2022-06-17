// 第三方模块 别人写好的模块我们可以安装来用
// 模块分为两种  1） 全局模块 （只能在命令行中使用的模块）  2） 项目依赖的模块

// node中有三个常用的模块 npm (安装包) nrm （切换源） nvm(在windows需要特定的安装win版)
// npm install nrm -g
// C:\Users\test1\AppData\Roaming\npm\nrm -> C:\Users\test1\AppData\Roaming\npm\node_modules\nrm\cli.js
// nrm use 某个源，安装的时候就可以这个源来安装

// 正常来说在path路径下的模块都可以执行， 并没有把全局模块放到path下而是将这个模块放到了npm目录下，npm在path中，所以所有的模
// 块都可以执行

// 如何编写一个全局模块呢？
// npm init -y 先初始化包 包就是多个模块的集合
// 需要配置一个bin属性作为入口来执行, 需要增加bin字段，到时候发布到npm上，在下载下来-g就会生成到对应的全局npm中了

// 如果是测试可以在当前包下 npm link 可以将这个包临时的放在全局的npm下

// C:\Users\test1\AppData\Roaming\npm\zf-xxx -> C:\Users\test1\AppData\Roaming\npm\node_modules\zf-xxx\bin\www
// C:\Users\test1\AppData\Roaming\npm\node_modules\zf-xxx -> C:\Users\test1\Desktop\promise\5.npm

// 最终别忘了 可执行文件需要增加 执行头 #! /usr/bin/env node

// > 可以尝试自己发布一个包， 作用域包。  @wakeupmypig/xxx


// 第三方模块 很多种依赖方式    @版本号来指定 
// 版本号一般分为三部分  major.minor.patch  大.小.补丁  ^大版本锁定了,后面的只要比当前大的就想 3>2.x.x>2   ~限制了前两位 2.3.x    (>= <=  1~2)

// 一般情况下 lock文件不应该被删除，这样下次安装会安装相同的版本

// 项目依赖 开发上线都需要的，  npm install xxx
// 开发依赖 只在开发时使用，    npm install xxx -D 
// 同等依赖 我安装vue  -》 vue-template-compiler   会提示需要某个模块没有装
// 可选依赖
// 打包依赖 

// 执行代码的方式
// 有的全局包可以安装到本地来使用， 这里需要注意的是一般情况下像开发工具都是安装到本地的
// npm install mime -g， 如果你的全局模块安装到当前项目中 node_modules下会在.bin目录下生成可执行文件
// 如果通过npm run来执行命令，会将当前项目下的node_modules/.bin放到path中 在执行对应的命令
// 这里可以通过npm run 来执行脚本， npx也可以执行脚本（如果脚本不存在会安装在执行，邢湾会删除掉） 原理也是将
// 我们的node_modules/.bin放到path


