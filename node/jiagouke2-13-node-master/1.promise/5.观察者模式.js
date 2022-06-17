
// 观察者（父母）   被观察者（小宝宝）  观察者模式是基于发布订阅的
// 小宝宝要接纳父母的观测，状态变化后要主动通知父母
class Subject{
    constructor(name){
        this.name = name; // 被观察者的名字
        this.state = '玩着呢';
        this.observers = []; // 存放所有的观测者
    }
    attach(o){ // event.on()
        this.observers.push(o); // 订阅
    }
    setState(newState){
        this.state = newState;
        this.observers.forEach(o=>o.update(this)) // 发布， 自动发布 不需要用户手动触发
    }
}
class Observer{
    constructor(name){
        this.name = name;
    }
    update(s){
        console.log('当前'+this.name,`目前${s.name}的心情是${s.state}`)
    }
}

let s = new Subject('小宝宝');
let o1 = new Observer('爸爸');
let o2 = new Observer('妈妈');
s.attach(o1);
s.attach(o2);
setTimeout(()=>{
    s.setState('大人得陪小孩玩')
},1000)
// function Subject(name){
//      this.name = name
// }


// Subject.prototype.xxx