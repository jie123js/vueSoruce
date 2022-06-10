
export let activeEffectScope =null

class EffectScope {
    active=true;
    parent =null;
    effects = [];
    scopes =[]; //effectScope里面可能还有子级的effectScope需要收集
    constructor(detached=false) {
        //只有不独立的才收集
        if(!detached&&activeEffectScope){
            activeEffectScope.scopes.push(this)
        }
        
    }
    
    run(fn){
        if(this.active){
            try{

                this.parent = activeEffectScope
                activeEffectScope = this

                return fn()

            }finally{
                activeEffectScope = this.parent
            }
        }
    }
    stop(){
        if(this.active){
            for(let i =0;i<this.effects.length;i++){
            this.effects[i].stop()
            }
            for(let i=0;i<this.scopes.length;i++){
                this.scopes[i].stop()
            }
            this.active=false
        }
    }

}

export function recordEffectScope(effect){
    if(activeEffectScope&&activeEffectScope.active){
        activeEffectScope.effects.push(effect)
    }
}


export function effectScope(detached){
    return new EffectScope(detached)
}