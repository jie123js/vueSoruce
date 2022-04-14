let id = 0;
class Dep {
  //dep记住watcher  watcher记住dep
  constructor() {
    this.subs = [];
    this.id = id++;
  }
  depend() {
    // this.subs.push(Dep.target); //这样写会重复收集(如果一个页面用多次相同属性如name) 需要加唯一标识给watcher
    //我们这需要让dep记住watcher,watcher记住dep,这是一个双向奔赴的过程
    Dep.target.addDep(this); //再在watcher中调用dep的addSub方法
  }
  addSub(watcher) {
    //这样写的好处是只要记住一次  不用dep和watcher分别记住 增加判断了
    this.subs.push(watcher); //让dep记住watcher
  }
  notify() {
    this.subs.forEach((watcher) => {
      watcher.update();
    });
  }
}

Dep.target = null; //做一个标识  静态属性 其实就是static target 一样
export default Dep;
