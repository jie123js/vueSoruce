//理解  let render = new Function(`with(this){return ${code}}`);

//todo new Function 就是把字符串转成函数   eval的话是把字符转执行但是我们目前只要变成函数

//例子
//因为我们并不知道 别人会传几个参数过来,但是用了with他会自己去别人的作用域里面找

function demo() {
  with (this) {
    console.log(name);
    console.log(age);
  }
}

let data = { a: 1, c: 2, name: "kobe", age: 24 };
demo.call(data);
console.log(demo.call(data));
