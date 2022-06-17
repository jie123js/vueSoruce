const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');
const os = require('os');
const { createReadStream } = require('fs')

// -------------------
const chalk = require('chalk');
const mime = require('mime');
const ejs = require('ejs')

let networks = os.networkInterfaces();
let address = Object.values(networks).flat().find(item => item.family === 'IPv4').address

class Server {
    constructor(options) {
        this.port = options.port;
        this.directory = options.directory;
    }
    handleRequest = async (req, res) => {
        const { pathname } = url.parse(req.url); // 获取资源路径
        let filepath = path.join(this.directory, pathname);

        try {
            let statObj = await fs.stat(filepath);
            if (statObj.isFile()) {
                this.sendFile(filepath, req, res, statObj)
            } else {
                let dirs = await fs.readdir(filepath);
                dirs = dirs.map(dir => ({ dir, href: path.join(pathname, dir) }))
                let htmlStr = await ejs.renderFile(path.resolve(__dirname, 'template.html'), { dirs });
                res.end(htmlStr)
            }
        } catch (e) {
            console.log(e)
        }
    }
    sendFile(filepath, req, res, statObj) {
        // 默认通过浏览器访问服务端资源浏览器会携带一个 Cache-control:max-age=0 , 首页不会走强制缓存，无论如何都要访问服务器

        // 老的写法, 问题在于 你设置的这个时间是以服务端为准的。 有问题, 两个同事设置以后面的为准
        res.setHeader('Cache-Control', 'max-age=0'); // 新的为准
        res.setHeader('Expires', new Date(Date.now() + 1000).toGMTString())

        // 如果强制缓存失效了，还是会再次处理请求，那就浪费性能（原封不动的在读取一次） 比较稳健到底有没有变

        let lastModified = statObj.ctime
        // res.setHeader('Last-Modified',lastModified); // 你第一次来我给你个文件的最后修改时间

        // // 下次来会携带这个修改时间
        let ifNodifiedSince = req.headers['if-modified-since'];

        if(ifNodifiedSince === lastModified){
            res.statusCode = 304;
            return res.end()
        } 
        // 万一文件改了，但是内容没变。 如果1s内多次修改也监控不到 (有可能文件变化了但是没有渲染最新的)


        // 如果直接比对文件内容，读取文件的内容。 消耗性能  -》 比较长度  用文件的长度+最后修改时间作为一个指纹来处理

        let etag = new Date(lastModified).getTime().toString(16) + '-' + statObj.size.toString(16);
        res.setHeader('Etag', etag)
        let ifNoneMatch = req.headers['if-none-match'];
        if (ifNoneMatch === etag) {
            res.statusCode = 304;
            return res.end()
        }

        // 按照规范来说 有etag的时候就不采用last-modified


        // 如果文件访问过了，那么每次都请求 浪费性能

        res.setHeader('Content-Type', mime.getType(filepath) + ';charset=utf-8');
        createReadStream(filepath).pipe(res)
    }
    start() {
        const server = http.createServer(this.handleRequest);
        server.listen(this.port, () => {
            console.log(`Available on:
    http://${address}:${chalk.green(this.port)}
    http://127.0.0.1:${chalk.green(this.port)}
${chalk.yellow('Hit CTRL-C to stop the server')}`)
        })
    }
}

module.exports = Server



// cdn的原理 + dns + 反向代理
// https  h1 h2 h3 
