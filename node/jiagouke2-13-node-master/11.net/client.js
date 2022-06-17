const net = require('net'); // node中的tcp模块
const socket = new net.Socket();
// 连接8080端口
socket.connect(8080, 'localhost');
// 连接成功后给服务端发送消息
socket.on('connect', function(data) {
    socket.write('hello'); //客户和服务端端说 hello
    // socket.end(); // 断开连接
});
socket.on('data', function(data) {
    console.log(data.toString())
})
socket.on('error', function(error) {
    console.log(error);
});