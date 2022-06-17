const qs = require('querystring')

const bodyparser = {
    json() {
        return function (req, res, next) {
            if (req.get('Content-Type') !== 'application/json') { return next()}
            let arr = []
            req.on('data', function (chunk) {
                arr.push(chunk)
            });
            req.on('end', function () {
                let data = Buffer.concat(arr).toString()
                req.body = JSON.parse(data)
                next()
            })
        }
    },
    urlencoded() {
        return function (req, res, next) {
            if (req.get('Content-Type') !== 'application/x-www-form-urlencoded') { return next()}
            let arr = []
            req.on('data', function (chunk) {
                arr.push(chunk)
            });
            req.on('end', function () {
                let data = Buffer.concat(arr).toString()
                req.body = qs.parse(data, '&', '=')
                next()
            })
        }
    }
}

module.exports = bodyparser