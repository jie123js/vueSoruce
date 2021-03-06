## OSI理想化的模型
模型的目的就是为了分层。实现每一层可以单独去做自己擅长的事情

> 下层是为了上层提供服务的，没有底层的基础是没有办法工作的


发送了http请求，这个过程 这几层是怎么工作的 
- 应用层 发送的内容                报文信息    http  dns  dhcp
- 表示层 数据怎么表述
- 会话层 建立会话
-----------------------------
- 传输层  考虑如何将数据安全、不安全 目的就是传输  端口号  数据段   tcp/udp
- 网络层  寻址 怎么找到最近的路线，定位到目的地    ip地址 -》 转化成对方mac地址  数据包   ip/协议 
-----------------------------   
- 数据链连路层  链路层就要关心如何把数据传递给对方  （路线）  mac地址   数据帧  (三层以上的才有协议的概念)
- 物理层   主要负责的就是把数据传递给对方 010101 怎么表示0 1的  （网线，双绞线）

1) 每一层做了哪些事  2）每一层特点 报文/数据段/数据包/帧  3）协议  4）底层对应的物理设备


局域网
- 物理层的设备  中继器  集线器是中继器的升级版（可以连接多台设备 问题就是通信 采用的是广播的方式）
- 数据链连路层  交换机  安全些，可以实现私密通话了
- 网络层 路由器 连接外网的 （网关）  路由器在不使用上网能力的时候他就是一个交换机  （能连接两个网络）


域名  IP  MAC地址 之间的关系
- 通过mac地址可以实现端到端的通信  mac地址长不好记忆  arp -> ip地址   dns（常见的有ipv4地址  ipv6）-> 域名



## 协议
- 应用层 HTTP DNS DHCP
- 传输层 UDP/TCP
- 网络层 IP ARP ip->mac地址的


- HTTP                                   DNS
- TCP（可靠，建立连接三次握手四次断开）     UDP （面向非连接 ）


### DNS 就是做一个映射表 映射ip和域名的 缓存的

- 1） 先查找我们是否有缓存，如果有缓存不用解析了
- 2) 会看下本地hosts文件是否有信息如果没有 才要去dns解析
- 3)  我们通过路由器来解析   通过自己定义的来解析



## tcp传输数据
- 我需要有自己的端口和目标端口才能发送数据 
- 发送数据我们需要3次握手  发送数据的时候要对数据进行拆分 （序列号） 为了能数据重组
- 发送数据 我们要动态调整发送数据的量 （流量控制） 滑动窗口，如果每次发送的数据太少 需要把小的断连在一起（粘包）
- 如果发送的数据丢包了，丢了后需要重传。 可靠
- 对方接收到后会 按照序列号进行数据的重组
- 如果请求结束了，我们还需要四次断开


为什么握手是三次 断开是四次  （握手两次不行么？）  挥手为啥是四次  (挥手后，断开方需要等待一段时间，端口号还是被占用，如果端口号耗尽，就没法处理请求)



## tcp是如何建立连接的
客户端准备了2个值seq = 0  ack = 0
服务端响应 seq=0  ack=1  在客户端的序列上+1 作为ack

单向连接了

客户端同意握手 ack在服务端seq的基础上+1， 并且用服务端的ack作为seq


序列号是我期待的 ack 应答了


上一次的ack作为本次的seq ， 上一次seq+1 作为这次的ack
-------------seq = 1  ack = 1---------------------

客户端push 5  服务端响应你 seq + push = 6  seq = 1

服务端push 2  客户端响应你  seq + push = 3 seq = 6 客户端的seq

seq = 6  ack = 3

服务端push 5  客户端响应你  ack = 8    seq =6


seq +len == ack   上次ack 作为本次seq 
----------- 客户端seq=1  ack6-------------------

断开的时候需要基于上次的序列号+1作为应答
上次的ack作为本次的seq

断开就是让seq 和 ack分别+1

----------------

## UDP不可可靠的原因
不关心对方收没收到而且不需要简历链接， 直播 DNS应用层 基于UDP

HTTP1.0 开始都是基于tcp的 从http3开始 传输层换成了udp;


## tcp特点
1.滑动窗口，优点就是流量控制，在握手的时候可以确定窗口大小，根据窗口大小发送数据。 可能会导致队头阻塞问题
2.接收方和发送方都有自己的缓存区，如果接收不了后，会持续发送探测包来确定是否需要继续发送，如果被消耗掉了数据，会自动发送可以继续发送的包


## 窗口大小如何定义的 
拥塞控制 控制传输的大小  窗口大小 （协商一个大小） 采用快重传、超时慢启动实现流量控制


tcp的特点：流量控制，滑动窗口（队头阻塞），（ 慢启动， 超时重传， 快重传）  粘包.

缺点：慢启动 队头阻塞 端口占用问题

node中实现粘包默认采用的是nagle算法  CORK算法