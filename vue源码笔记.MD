**所以陌生人，别贪心我们不可能什么都有，也别担心，我们不可能什么都没有，加油！**

## 一、3.15学习总结

### 1、一些特殊的简写方式
1) 正常这样写
![](img/微信截图_20220315102409.png)
2) 可以简写![](img/微信截图_20220315102430.png)
3) 使用![](img/微信截图_20220315102503.png)

### 2、关于...剩余运算符
```JavaScript
  function a(v,...args) {
          console.log(args); //=>[2, 3]
			console.log(...args); //=>2 3
            if (3 > 2) {
                return console.log('return');
            }
          console.log(321);
        }
        a(1, 2, 3)
```
这个args单纯的只是一个形参 我取名a b c什么都可以只是arg是大家比较习惯取 只要是...这个运算符的作用
剩余参数是指函数定义时以...为前缀的参数，这个参数是一个没有对应形参的实参组成的一个数组，所以它与arguments有一定的区别，剩余参数中可以使用push、map等数组方法

### 3、闭包里面的return
函数如果执行return 后面代码是不会执行的 不管是函数里面套函数(错的只有if语句才会)  如上面a函数 console.log(321);永远不会执行
上面说的不对  上面是因为if语句
假如变成
```JavaScript
	 function a(){
			b()
			console.log(111);
		}

		function b(){
			if(3>2){
				return
			}
		}
		a()
		函数里面套函数会执行 控制台会打印111
		
		function a(){
			if(3>1){
				return console.log(222)
			}
			console.log(111);
		}
		
		function b(){
			if(3>2){
				return
			}
		}
		a() 这里就只会打印222了
		
		```

### 4、关于call的一些问题
![](img/微信截图_20220316095820.png)
call是可以接受好多参数的这里用...展开运算符把数组展开了
如果用apply的话 apply(this.args)就可以了 因为他可以第二个参数是一个数组
  //如果data写的是函数this指向是window所以我们需要用call重置(对call的一个理解call里面如果写个this当第一个参数,意思就是谁调用他就谁当this,不改变原来执行的this)
  //例子 arr.push.call(this) 那这个就是正常执行push方法原来的this其实arr 这样写的好处是可以加多个参数因为call第二个参数可以是数组 arr.push.call(this,...args)
  data = vm._data = isFunction(data) ? data.call(vm) : data;