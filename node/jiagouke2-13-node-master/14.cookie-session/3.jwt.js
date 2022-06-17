// jwt 这种方式 服务端不记录用户的登录状态， 只需要存储秘钥    和 刚才讲的cookie签名一样的原理


const express = require('express');
const jwt1 = require('jwt-simple')

// 一般在正式项目中 jsonwebtoken 来实现， jwt-simple

const app = express();

const jwt = {
    sign(value, secret) {
        return this.toBase64URL(require('crypto').createHmac('sha256', secret).update(value).digest('base64'))
    },
    toBase64URL(str) {
        return str.replace(/\=/g, '').replace(/\+/, '-').replace(/\//, '_')
    },
    toBase64(content) {
        return this.toBase64URL(Buffer.from(JSON.stringify(content)).toString('base64'));
    },
    encode(payload, secret) {
        let v1 = this.toBase64({ typ: 'JWT', alg: 'HS256' })
        let v2 = this.toBase64(payload); // payload 一般就放一个有效期和我们的唯一标识
        let v3 = this.sign(v1 + '.' + v2, secret)
        return [v1, v2, v3].join('.')
    },
    // base64urlUnescape(str) {
    //     str += new Array(5 - str.length % 4).join('=');
    //     return str.replace(/\-/g, '+').replace(/_/g, '/');
    // },
    decode(token, secret) {
        let [v1, payload, sign] = token.split('.');
        let newSign = this.sign(v1 + '.' + payload, secret);
        if (newSign === sign) {
            let data =  JSON.parse(Buffer.from(payload,'base64url').toString())

            if(new Date(data.expr).getTime() < Date.now() ){
                throw new Error('token 过期')
            }
            // payload 转会正常的base64 
            return data
        }else{
            throw new Error('token error')
        }

    }
}


app.get('/login', function (req, res) {
    let token = jwt.encode({ name: 'jw',expr:new Date(Date.now() + 10*1000 ).toGMTString()}, 'secret');
    // eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiancifQ.fk5plqJg6UQKUEoLQzvRjJ1VCWuswei44Kmwlou6WPQ
    res.send({
        err: 0,
        data: {
            token,
        }
    })
});
app.get('/validate', function (req, res) {
    let token = req.query.token;
    try {
        let data = jwt.decode(token, 'secret')
        res.send({
            err: 0,
            data
        })
    } catch (e) {
        console.log(e)
        res.send({
            err: 1,
            data: '令牌出错'
        })
    }
})





app.listen(3000, () => {
    console.log(`server start 3000`);
})


