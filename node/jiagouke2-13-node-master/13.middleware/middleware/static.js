const path = require('path')
const fs = require('fs')

function static(absPath){ // 插件就是一个函数 ， 因为可以提供参数实现功能， express要求插件要返回一个中间件函数
    return function(req,res,next){
        // 如果访问的是静态文件，则找到返回 ， 如果不是则直接向下执行
        let filePath =  path.join(absPath,req.path);
        fs.stat(filePath,function(err,statObj){
            if(err){
                next(); // 不存在就不处理了
            }else{
                if(statObj.isFile()){
                    res.sendFile(filePath)
                }else{
                    // 是文件夹就找 index.html, 找index.json
                    next();
                }
            }
        })
    }
}

module.exports = static