const net = require('net');
const server = net.createServer(function(socket){ // http.createServer
    socket.on('data',function (data) { // 客户端和服务端
        socket.cork();
        socket.write('1');
        socket.write('2');
        socket.write('3');
        socket.write('4');
        socket.uncork()
        // socket.write('hi'); // 服务端和客户端说 hi
        // socket.write('hello');
    });
    socket.on('end',function () {
        console.log('客户端关闭')
    })
})
server.on('error',function(err){
    console.log(err);
})
server.listen(8080); // 监听8080端口