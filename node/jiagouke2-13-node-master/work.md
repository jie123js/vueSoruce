- 浏览器中ESMdoule和commonjs的区别？
- 模板引擎的实现原理？ vm.runInThisContext
- 如何发布一个作用域包
- 编码的发展历程。
- 浏览器中事件环和node事件环的区别？
- 如何实现一个base32编码
- 思考代码执行结果: 
```js
Promise.resolve().then(() => {
    console.log(0);
    return new Promise((resolve)=>{
        resolve('a');
    })
}).then(res => {
    console.log(res)
})
Promise.resolve().then(() => {
    console.log(1);
}).then(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(4);
}).then(() => {
    console.log(5);
})
```
- 总结下之前学过的内容