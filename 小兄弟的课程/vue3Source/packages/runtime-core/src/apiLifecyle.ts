import { currentInstance, setCurrentInstance } from "./components";

export const enum LifecycleHooks {
  BEFORE_MOUNT = "bm",
  MOUNTED = "m",
  BEFORE_UPDATE = "bu",
  UPDATED = "u",
}

function createHook(type) {
  return (hook, target = currentInstance) => {
    const hooks = target[type] || (target[type] = []);
    // hooker.push(hook);//这样写组件钩子拿不到实例因为setup结束后 组件实例设置为null了
    //todo 把实例存起来
    const wrappedHook = () => {
      //闭包
      setCurrentInstance(target);
      hook();
      setCurrentInstance(null);
    };
    hooks.push(wrappedHook);
  };
}

//工厂模式
export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT);

export const onMounted = createHook(LifecycleHooks.MOUNTED);

export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE);

export const onUpdated = createHook(LifecycleHooks.UPDATED);
