## 6.22

### 1.时间循环和浏览器渲染
剩下的知识看架构的源码资源
```JavaScript
这里是132 然后渲染是直接黄色 不会看到先红后黄  因为浏览器渲染是在微任务后面的,如果换成定时器是可以看到红黄的
<script>
        document.body.style.background = 'red';
        console.log(1)
        Promise.resolve().then(()=>{
            console.log(2)
            document.body.style.background = 'yellow';
        })
        console.log(3);
</script>

```


```JavaScript

<script>
        button.addEventListener('click',()=>{
            console.log('listener1');
            Promise.resolve().then(()=>console.log('micro task1'))
        })
        button.addEventListener('click',()=>{
            console.log('listener2');
            Promise.resolve().then(()=>console.log('micro task2'))
        })
        button.click(); // click1() click2()
		//这个执行结果是 listener1 listener2 micro task1 micro task2   因为浏览器把这2个时间当成普通函数处理了  只有用户点击的是宏任务
		
		
		button.addEventListener('click',()=>{
		    console.log('listener1');
		    Promise.resolve().then(()=>console.log('micro task1'))
		})
		button.addEventListener('click',()=>{
		    console.log('listener2');
		    Promise.resolve().then(()=>console.log('micro task2'))
		})
		//button.click(); // click1() click2()
		把函数的调用的点击取消   让用户自己点击  执行结果就是   listener1 micro task1   listener2 micro task2
		因为用户点击就是宏任务了
		
</script>




```



```JavaScript


<script>
        Promise.resolve().then(() => {
            console.log('Promise1')
            setTimeout(() => {
                console.log('setTimeout2')
            }, 0);
        })
        setTimeout(() => {
            console.log('setTimeout1');
            Promise.resolve().then(() => {
                console.log('Promise2')
            })
        }, 0);
		
		
		
		//1 1 2 set2
		一开始代码从上往下执行  把promise 放到微任务队列 把setTimeout放到宏任务队列
		先清空微任务队列执行 遇到定时器把定时器放到宏任务队列  然后执行宏任务队列
</script>
```


```JavaScript

		时间到达后会将回调放到队列中  (消息队列)
  console.log(1);
        async function async() {
            console.log(2);
            await console.log(3);
// await 下面的代码 相当于放到了then中   await后面的代码相当于同步一样执行 然后下一行的被包装成了promise.resolve(fn()).then(()=>console.log(4))
            console.log(4)
        }
        setTimeout(() => {
            console.log(5);
        }, 0);
        const promise = new Promise((resolve, reject) => {
            console.log(6);
            resolve(7)
        })
        promise.then(res => {
            console.log(res)
        })
        async();
        console.log(8);

  
        //1 6 2 3 8 7 4 5


		微任务队列 [7 4]
		宏任务队列  [5]


```