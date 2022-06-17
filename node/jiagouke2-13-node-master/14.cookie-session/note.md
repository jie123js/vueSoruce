# cookie 和 session , sessionStorage localStorage区别
> 这两个只能同域
- sessionStorage 会话关掉了就丢失了 （sessionStorage） 浏览器存储的数据  存一些关掉页面就不需要的数据
- localStorage 浏览器关掉不会丢失， 需要手动删除 （空间也是有限的） 前端优化中为了js加载快，可以把js、css存到localstrage中

> cookie的特点  

- http的特点默认是无状态的，默认第一次请求和第二请求是不产生关联的 (cookie里来存储状态)， 每次请求都可以携带cookie。 为了减少请求消耗的流量 尽量cookie合理化  可以浏览器存储 document.cookie   可以服务端通过响应头来设置 （默认可以限制二级域名共享cookie）.不宜过大，可能会导致页面白屏  （安全问题）

- session特点是安全一些 （重要的内容存到服务器中） 中间通信靠cookie来进行通信  session基于cookie的

目前开发 都是前后端分离 （跨域  cookie默认不支持跨域）, 前后端同构项目 我们写的代码都是嵌在服务端中的，服务端渲染的 cookie

