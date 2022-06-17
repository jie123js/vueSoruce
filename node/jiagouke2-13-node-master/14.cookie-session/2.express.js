const express = require('express');
const cookieParser = require('cookie-parser')
const uuid = require('uuid');
let app = express()

const session = {}; // session就是内存中的一个对象，session 如果服务器关掉了就丢失了。 我们一般会把session存储到数据库中
app.use(cookieParser('zf')); // secret 秘钥

let cardName = 'connect.sid'; // 卡名字

// 类似于cookie签名的方式 



// 服务器得存储一下信息，重启还丢 （存数据库还会发生宕机）
app.get('/wash', function (req, res) {
    let cardNum = req.signedCookies[cardName]; // 验证后的cookie
    if (cardNum && session[cardNum]) { // 表示第二次来了
        session[cardNum].mny -=10;
        res.send('你现在的余额是：'+session[cardNum].mny)
    } else {
        // -----------------
        const cardId = uuid.v4();
        session[cardId] = { mny: 100 }; // 将重要信息存储到服务器中
        res.cookie(cardName, cardId, { signed: true }); // 给客户端

        res.send('你是第一次来办张卡')
    }
})


app.get('/read', function (req, res) {
    res.send(req.signedCookies.name);
})

app.get('/write', function (req, res) {
    res.cookie('name', 'zf', { maxAge: 20 * 1000, signed: true });
    res.send('写入成功')
})

app.listen(3000, () => {
    console.log(`server start 3000`);
})