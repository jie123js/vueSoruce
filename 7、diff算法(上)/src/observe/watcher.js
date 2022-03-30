import Dep from "./dep";
import { queneWatcher } from "./scheduler";
let id = 0;
class Watcher {
  constructor(vm, fn, cb, options) {
    //为了让页面后续使用先把接受的值保存在this里面
    this.vm = vm;
    this.fn = fn;
    this.cb = cb;
    this.options = options;
    this.id = ++id;
    this.depsId = new Set(); //set里面不能放重复的数据
    this.deps = [];
    this.getter = fn; //fn就是页面渲染逻辑
    this.get();
  }
  addDep(dep) {
    let did = dep.id;
    if (!this.depsId.has(did)) {
      this.depsId.add(did);
      this.deps.push(dep); //做了一个保存id的功能 并且让watcher记住dep
      dep.addSub(this);
    }
  }
  update() {
    //为什么更新不直接调用get() 因为有可能一直重复修改
    //在这里可以做异步更新
    console.log("update"); //每次更新数据都会同步调用这个update方法,我们可以将更新逻辑缓存起来,等会同步更新的逻辑结束后,依次调用
    queneWatcher(this);
    //this.get();
  }
  run() {
    console.log("run");
    this.get(); //render()取的是最新的vm上的数据(所以就算同时有好几个watcher1,后面的不放进来也不影响)
  }

  get() {
    Dep.target = this; //在数据get前先赋值

    this.getter(); //页面渲染逻辑   为什么不能放在set里面 因为有可能set里面的数据没在试图中使用,是没必要重新渲染页面的
    //调getter 里面的render函数 _s _v _c 会去获取数据vm.name vm.age就会走对象的get
    Dep.target = null; //防止重复收集  渲染完毕就清空标识  只有在渲染的时候或者更新的时候才依赖收集
  }
}

export default Watcher;
