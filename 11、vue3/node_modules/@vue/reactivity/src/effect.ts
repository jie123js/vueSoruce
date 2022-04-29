export function effect(fn, option: any = {}) {
  //fn默认是不具备数据变化更新视图的功能
  let effect = createReactiveEffect(fn, option); //把fn包裹成一个响应式的函数
  if (!option.lazy) {
    effect();
  }
  return effect;
}

let uid = 0;
let activeEffect;
function createReactiveEffect(fn, option) {
  const effect = function () {
    //需要把effect暴露出去
    activeEffect = effect; //类似以前vue2的 Dep.target = watcher
    fn();
    activeEffect = null;
  };
  effect.id = uid++;
  effect._isEffect = true;
  effect.raw = fn;
  effect.deps = [];
  effect.options = option;
  return effect;
}

const targetMap = new WeakMap(); //为什么里面不用weakmap因为weakmap的key必须是对象
export function track(target, type, key) {
  //创建一个{obj:(name:[effect.effect])}  建是对象,值是一个map,map里面值是一个set
  if (!activeEffect) {
    //不在effet里面的不进行依赖收集
    return;
  }
  console.log(111);

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
  console.log(targetMap);
}
export function trigger(target, key, value) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  effects && effects.forEach((effect) => effect());
}
