export let activeEffect = undefined;

function cleanupEffect(effect) {
  const { deps } = effect;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect);
  }
  effect.deps.length = 0;
}
//todo TS中类的写法会有点不同
export class ReactiveEffect {
  public active = true; //相当于this.active = true
  public parent = null;
  public deps = []; //这个用于effect记录属性  多对多关系
  constructor(public fn, public scheduler?) {
    //加了public相当于this.fn=fn
  }
  run() {
    if (!this.active) {
      //如果非激活不用依赖收集
      return this.fn();
    }
    try {
      this.parent = activeEffect; //第一次是null  第二次进来因为上一次的还没执行好 记录下他的父亲
      activeEffect = this;
      //这里执行前清空之前收集的内容
      cleanupEffect(this);
      return this.fn();
    } finally {
      activeEffect = this.parent;
      // this.parent = null; //结束后没啥意义 清空就好了(可写可不写)
    }
  }
  stop() {
    if (this.active) {
      this.active = false;
      cleanupEffect(this);
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

//todo 可能出现的bug
/* 
effect(()=>{
  state.name ='n' //第一次activeEffect = e1
  effect(()=>{//第二次又new了一个effect  第二次activeEffect = e2 然后直接finally,activeEffect=undefined
    state.age = 2
  })
  state.add = 'xx' //此时这个activeEffect=undefined
}) */
//todo 解决方法 弄成树结构给每个class整一个parent

const targetMap = new WeakMap();
export function track(target, type, key) {
  if (!activeEffect) return; //如果不是在effect函数里面写的就不依赖收集

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  trackEffects(dep);
}
//目前是单向记录,属性记住了effect,effect还没有记住属性

export function trackEffects(dep) {
  if (activeEffect) {
    let shouldTrack = dep.has(activeEffect);
    if (!shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep); //之后清理的时候会用到,目前还没用到
    }
  }
}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return; //触发的值不在模板中
  let effects = depsMap.get(key);
  if (effects) {
    triggerEffects(effects);
  }
  /*  effects &&
    effects.forEach((effect) => {
      if (effect == activeEffect) return; //这个是防止死循环 一个优化

      effect.run();
    }); */
}

export function triggerEffects(effects) {
  effects = new Set(effects); //或者 [...effects]  拷贝一份防止循环引用
  effects.forEach((effect) => {
    if (effect == activeEffect) return; //这个是防止死循环 一个优化
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}
