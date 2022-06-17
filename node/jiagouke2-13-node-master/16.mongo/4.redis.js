const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
function getValue(key) {
    return client.get(key)
}
function setValue(key, value, expires) {
    // 如果是对象可以json.stringify
    if (typeof expires == undefined) {
        return client.set(key, value)
    } else {
        return client.set(key, value, { EX: expires })
    }
}
function remove(key) {
    return client.del(key)
}
function getExpires(key) {
    return client.ttl(key);
}
; (async () => {
    await client.connect();
    let value = await  setValue('name', 'zf')
    // console.log(value)
    // let r =await remove('name');
    // console.log(r)

    await client.subscribe('clear',function(value){ // 可以借助发布订阅推送消息 
        // client.del(value)
        //  remove(value);
    })
})()


// setTimeout(() => {
//     client.disconnect()
// }, 1000)


// 发布订阅 支持发布订阅 核心就是希望 可以告诉redis 来清空数据