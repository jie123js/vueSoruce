// 文件夹就是一个树结构, 我们就需要操作树了

const fs = require('fs');
const path = require('path');


// 我们创建目录的时候要保证上一级目录是存在的，工程化打包，我们需要创造一个文件夹将结果放到这个文件夹中
// fs.mkdir(path.resolve(__dirname,'a/b/c/d'),{recursive:true},function(err){
//     if(err)return console.log(err)
//     console.log('make ok')
// });

// 因为目录不为空不能删除  (想做删除，我们需要先删除儿子，在删除自己)

// fs.readdir(path.resolve(__dirname,'a'),function(err,dirs){ // 这里我们只能读取子目录，在后代的无法读取
//     dirs = dirs.map(item=>path.resolve(__dirname,'a',item)); // 拼接路径
//     dirs.forEach(dir=>{
//         fs.stat(dir,function(err,statObj){
//             if(statObj.isDirectory(dir)){
//                 fs.rmdir(dir,function(){});
//             }else if(statObj.isFile(dir)){
//                 fs.unlink(dir,function(){})
//             }
//         })
//         删除自己
//     })
// });

// fs.rmdir(path.resolve(__dirname,'a'),function(err){
//     if(err)return console.log(err)
//     console.log('make ok')
// })



// 后续所有的逻辑 -> promise + async + await

// 1) 异步串行删除  (写递归的时候 先考虑2层的关系)
// function rmdir(filepath,cb){
//     fs.stat(filepath,function(err,statObj){
//         if(err) return cb(err);
//         if(statObj.isDirectory()){
//             fs.readdir(filepath,function(err,dirs){
//                 dirs = dirs.map(dir=>path.join(filepath,dir));
//                 let index = 0;
//                 // 我删除a 和 删除v 能不能一起做？  串行和并行
//                 function next(){
//                    if(dirs.length === index){ // express koa .....
//                         return fs.rmdir(filepath,cb) ; // 没有儿子直接删除
//                    }
//                    let dir = dirs[index++]; // 取出第一个儿子
//                    rmdir(dir,next)
//                 }
//                 next(); // 比如说我们操作dom节点，需要操作dom节点的儿子， 
//             })
//         }else{
//             fs.unlink(filepath,cb)
//         }
//     })
// }

// 异步并发删除 
// function rmdir(filepath, cb) {
//     fs.stat(filepath, function (err, statObj) {
//         if (err) return cb(err);
//         if (statObj.isDirectory()) {
//             fs.readdir(filepath, function (err, dirs) {
//                 if (err) return cb(err)
//                 dirs = dirs.map(dir => path.join(filepath, dir));
//                 // 删除完儿子后删除自己
//                 let times = 0;
//                 if(dirs.length === 0) return fs.rmdir(filepath, cb); // 如果空目录直接删除即可
//                 function done() { // 如果子路径删除完后，看一下是否要删除父路径
//                     if (++times === dirs.length) {
//                         fs.rmdir(filepath, cb)
//                     }
//                 }
//                 dirs.forEach(dir => rmdir(dir, done))
//             })
//         } else {
//             fs.unlink(filepath, cb)
//         }
//     })
// }
// 实现异步并发删除 promise版本
// function rmdir(filepath) {
//     return new Promise((resolve,reject)=>{
//         fs.stat(filepath, function (err, statObj) {
//             if (err) return reject(err);
//             if (statObj.isDirectory()) {
//                 fs.readdir(filepath, function (err, dirs) {
//                     if (err) return reject(err)
//                     // 并发操作我们可以考虑promise
//                     dirs = dirs.map(dir => rmdir(path.join(filepath, dir)));
//                     Promise.all(dirs).then(()=>{
//                         fs.rmdir(filepath, resolve)
//                     })
//                 })
//             } else {
//                 fs.unlink(filepath, resolve)
//             }
//         })
//     })
// }
// async + await版本
// async function rmdir(filepath) {
//     let statObj = await fs.stat(filepath);
//     if (statObj.isDirectory()) {
//         let dirs = await fs.readdir(filepath)
//         await Promise.all(dirs.map(dir => rmdir(path.join(filepath, dir))))
//         return fs.rmdir(filepath)
//     } else {
//         return fs.unlink(filepath)
//     }
// }

// rmdir(path.resolve(__dirname, 'a')).then(function () {
//     console.log('删除成功')
// }).catch(err=>{
//     console.log(err)
// })


// 同步代码 可以考虑用层序遍历   fs.rmdir({recursive:true})  rm -rf 某个文件夹
function rmdirSync(filepath) {
    let stack = [filepath];
    let index = 0;
    let current;
    while (current = stack[index++]) {
        let statObj = fs.statSync(filepath)
        if (statObj.isFile()) {
            fs.unlinkSync(current); // 文件直接删除即可 
        } else {
            stack = [...stack, ...fs.readdirSync(current).map(dir => path.join(current, dir))];
        }
    }
    let i = stack.length
    while (i--) {
        let currentPath = stack[i];
        fs.rmdirSync(currentPath)
    }
}
rmdirSync(path.resolve(__dirname, 'a'))
// fs.mkdir  fs.rmdir  fs.readdir  fs.stat(可以判断文件类型，如果文件不存在则会报错  isDirectory isFile) fs.unkink() 删除文件
