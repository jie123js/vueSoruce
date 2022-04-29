let obj = {};
let proto = {a:1}
let proxyProto = new Proxy(proto, {
    get(target,key,receiver) {
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        // console.log(proxyProto , receiver == myProxy); // 这个地方要屏蔽的
        return Reflect.set(target,key,value,receiver)// 不要考虑原型链的set
    }
})
Object.setPrototypeOf(obj,proxyProto); // 给obj赋值会触发proxyProto的set
let myProxy = new Proxy(obj,{  // proxy(obj)
    get(target,key,receiver) {
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        console.log(receiver === myProxy)
        return Reflect.set(target,key,value,receiver); // 调用reflect.set 会触发原型链的set
    }
})
proxyProto.a = 100; // 内部的特点 

console.log(myProxy.a,proto)