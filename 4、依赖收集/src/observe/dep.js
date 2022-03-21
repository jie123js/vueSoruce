let id = 0;
class Dep {
  //dep记住watcher  watcher记住dep
  constructor() {
    this.subs = [];
    this.id = id++;
  }
  depend() {
    this.subs.push(Dep.target);
    console.log(this.subs);
  }
}

Dep.target = null; //做一个标识  静态属性 其实就是static target 一样
export default Dep;
