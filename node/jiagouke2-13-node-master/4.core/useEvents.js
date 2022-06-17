const EventEmitter = require('events');

function Girl(){
    EventEmitter.call(this)
}
Girl.prototype = Object.create(EventEmitter.prototype);

let girl = new Girl();

girl.on('newListener',(eventName)=>{
   // 可以用来监控用户是否绑定了此事件 如果绑定了就触发逻辑
});


const shopping = () => console.log('购物')
const cry = () => console.log('哭')
const eat = () => console.log('吃')
girl.on('女生失恋',shopping); // {'女生失恋':[]}
girl.on('女生失恋',cry);
girl.once('女生失恋',eat); // 执行回调后删除


girl.off('女生失恋',eat);

 console.log(girl._events)
// // girl.off('女生失恋',shopping)
// girl.emit('女生失恋')
// console.log(girl._events)


// 读取文件， 

