const path = require('path');
const fs = require('fs').promises
const mime = require('mime');
const {createReadStream} = require('fs')
const {createGzip, createDeflate} =  require('zlib')


// http 你给我一个标识  我按照你的要求解析， 之后将解析的结果返给你，在增加上我的标识  协商

// 304  206  压缩  编码格式  协商

function static(dirname){
    return async (ctx,next)=>{
        let filepath = path.join(dirname,ctx.path); // 文件路径
        try{
            let statObj = await fs.stat(filepath)
            if(statObj.isFile()){
                ctx.set('Content-Type',mime.getType(filepath));


                let encoding = ctx.acceptsEncodings('gzip', 'deflate');
                // 浏览器支持gzip 
                if(encoding === 'gzip'){ // gzip 适合重复率比较高的文件 （重复的内容进行替换）
                    // 转化流    可读流 、 可写流、双工流、转化流
                    ctx.set('content-encoding','gzip')
                    ctx.body = createReadStream(filepath).pipe(createGzip()) // 将读取到的内容 pipe到 压缩处理里面去
                }else if(encoding === 'deflate'){
                    ctx.set('content-encoding','delfate')
                    ctx.body = createReadStream(filepath).pipe(createDeflate()) 
                }

                // ctx.body =await 
            }else{
                return next()
            }
        }catch(e){
            return next()
        }
    }
}
// app.use(static(__dirname))

module.exports = static