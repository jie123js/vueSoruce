const url = require('url')
const request = { // ctx.request.path
    get path(){
        // this = ctx.request
        // ctx.request.req = this.req
        return url.parse(this.req.url).pathname
    },
    get url(){
        return this.req.url
    },
    get method(){
        return this.req.method
    }
    /// ....
}


module.exports = request