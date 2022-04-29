export function addSubscription(subscriptions,cb){
    subscriptions.push(cb);
    return function reomveSubscription(){
        const idx = subscriptions.indexOf(cb);
        if(idx>-1){
            subscriptions.splice(idx,1);
        }
    }
}

export function triggerSubscription(subscriptions,...args){
    subscriptions.forEach( cb => cb(...args));
}