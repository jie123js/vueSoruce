const path = require('path')
const uuid = require('uuid')
const fs = require('fs').promises
Buffer.prototype.split = function (sep) {
    let len = Buffer.from(sep).length;
    let arr = [];
    let offset = 0;
    let index = 0;
    while (-1 !== (index = this.indexOf(sep, offset))) {
        let buffer = this.slice(offset, index);
        offset = index + len;
        arr.push(buffer);
    }
    arr.push(this.slice(offset));
    return arr;
}
function bodyparser(dirname) {
    return async (ctx, next) => {
        await new Promise((resolve, reject) => {
            let arr = [];
            ctx.req.on('data', function (chunk) {
                arr.push(chunk)
            })
            ctx.req.on('end', async function () {
                let type = ctx.get('content-type');
                let data = Buffer.concat(arr);
                if (type === 'application/x-www-form-urlencoded') { // a=b&c=d 不能放入二进制的
                    ctx.request.body = require('querystring').parse(data.toString())
                } else if (type.startsWith('multipart/form-data')) { // ---xxx---xxx---xxx 可以放入二进制的
                    // 文件的解析， 就是要解析http的请求体 
                    let boundary = '--' + type.split('=')[1];
                    let lines = data.split(boundary).slice(1, -1);
                    let result = {}
                    for (let line of lines) {
                        let [head] = line.split('\r\n\r\n');
                        let headLine = head.toString();
                        let value = line.slice(head.length + 4, -2)
                        let name = headLine.match(/name="([^"]+)"/)[1]
                        if (headLine.includes('filename')) { // 文件名
                            let filename = uuid.v4()
                            let uploadPath = path.join(dirname || path.resolve(__dirname, 'upload'), filename);
                            // 后缀名不影响文件本身
                            await fs.writeFile(uploadPath, value);
                            let arr = result[name] || []
                            arr.push({
                                filename,
                                size: value.length
                            })
                            result[name] = arr
                        } else {
                            result[name] = value.toString();
                        }
                    }
                    ctx.request.body = result;
                }
                resolve();
            })
        });
        return next()
    }
}

// 路由的实现 ， 模板引擎， 重定向处理，  cookie-session ， 压缩 多语言  
module.exports = bodyparser;


