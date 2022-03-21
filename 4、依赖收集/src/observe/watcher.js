import Dep from "./dep";

class Watcher {
  constructor(vm, fn, cb, options) {
    //为了让页面后续使用先把接受的值保存在this里面
    this.vm = vm;
    this.fn = fn;
    this.cb = cb;
    this.options = options;

    this.getter = fn; //fn就是页面渲染逻辑
    this.get();
  }
  get() {
    Dep.target = this; //在数据get前先赋值
    debugger;
    this.getter(); //页面渲染逻辑   为什么不能放在set里面 因为有可能set里面的数据没在试图中使用,是没必要重新渲染页面的
    //调getter 里面的render函数 _s _v _c 会去获取数据vm.name vm.age就会走对象的get
    // Dep.target = null; //防止重复收集  渲染完毕就清空标识  只有在渲染的时候或者更新的时候才依赖收集
  }
}

export default Watcher;
