import {
  reactive,
  readonly,
  toRaw,
  ReactiveFlags,
  Target,
  readonlyMap,
  reactiveMap,
  shallowReactiveMap,
  shallowReadonlyMap,
  isReadonly,
  isShallow
} from './reactive'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import {
  track,
  trigger,
  ITERATE_KEY,
  pauseTracking,
  resetTracking
} from './effect'
import {
  isObject,
  hasOwn,
  isSymbol,
  hasChanged,
  isArray,
  isIntegerKey,
  extend,
  makeMap
} from '@vue/shared'
import { isRef } from './ref'

const isNonTrackableKeys = /*#__PURE__*/ makeMap(`__proto__,__v_isRef,__isVue`)

const builtInSymbols = new Set(
  Object.getOwnPropertyNames(Symbol)
    .map(key => (Symbol as any)[key])
    .filter(isSymbol)
)

const get = /*#__PURE__*/ createGetter()
const shallowGet = /*#__PURE__*/ createGetter(false, true)
const readonlyGet = /*#__PURE__*/ createGetter(true)
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true)

const arrayInstrumentations = /*#__PURE__*/ createArrayInstrumentations()

function createArrayInstrumentations() {
  const instrumentations: Record<string, Function> = {}
  // instrument identity-sensitive Array methods to account for possible reactive
  // values
  ;(['includes', 'indexOf', 'lastIndexOf'] as const).forEach(key => {
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
      const arr = toRaw(this) as any // 将数组里的每个属性进行收集
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, TrackOpTypes.GET, i + '')
      }
      // we run the method using the original args first (which may be reactive)
      const res = arr[key](...args) // 调用数组原始的方法，获取返回值
      if (res === -1 || res === false) {  // 如果原始方法不工作，在将includes的参数转化为原始值处理
        // if that didn't work, run it again using raw values.
        return arr[key](...args.map(toRaw))
      } else {
        return res
      }
    }
  })
  // instrument length-altering mutation methods to avoid length being tracked
  // which leads to infinite loops in some cases (#2137)
  ;(['push', 'pop', 'shift', 'unshift', 'splice'] as const).forEach(key => {
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
      pauseTracking() // 调用此方法停止依赖收集
      const res = (toRaw(this) as any)[key].apply(this, args) 
      resetTracking() // 恢复依赖收集
      return res
    }
  })
  return instrumentations
}

function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE) {  // 是响应式对象的哪种？ readonly还是reactive
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) { // 看是不是readonly
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) { // 看是不是浅的
      return shallow
    } else if (
      key === ReactiveFlags.RAW && // 为了toRaw 方式所实现的，可以获取被代理对象对应的原始值
      receiver ===
        (isReadonly
          ? shallow
            ? shallowReadonlyMap
            : readonlyMap
          : shallow
          ? shallowReactiveMap
          : reactiveMap
        ).get(target)
    ) {
      return target
    }

    const targetIsArray = isArray(target)
    // 如果是数组对 'includes', 'indexOf', 'lastIndexOf' 方法进行处理
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }

    const res = Reflect.get(target, key, receiver)
    // 是内置symbol或者是访问的是__proto__属性直接返回
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res
    }
    // 不是readonly 进行属性的收集
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    if (shallow) {
      return res
    }

    if (isRef(res)) { 
      // ref unwrapping - does not apply for Array + integer key.
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key) // 如果访问的是数组的索引不进行脱ref
      return shouldUnwrap ? res.value : res
    }

    if (isObject(res)) { // 如果是对象继续进行深度代理
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

const set = /*#__PURE__*/ createSetter()
const shallowSet = /*#__PURE__*/ createSetter(true)

function createSetter(shallow = false) {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    let oldValue = (target as any)[key] // 获取老值
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) { 
      return false  
    }
    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {  // 如果深度代理，在赋值的时候先转换成非proxy
        value = toRaw(value)
        oldValue = toRaw(oldValue)
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value // 老的是ref 新的不是ref 则会给老的ref赋值
        return true
      }
    } else { // 浅层代理无所谓咋设置
      // in shallow mode, objects are set as-is regardless of reactive or not
    }
    // 查看是否有过这个key
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)
    const result = Reflect.set(target, key, value, receiver)
    // don't trigger if target is something up in the prototype chain of original
     if (target === toRaw(receiver)) { // 减少原型链的触发
      if (!hadKey) { // 添加
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) { // 如果前后置有变化触发修改逻辑
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
     }
    return result
  }
}

function deleteProperty(target: object, key: string | symbol): boolean {
  const hadKey = hasOwn(target, key)
  const oldValue = (target as any)[key]
  const result = Reflect.deleteProperty(target, key) 
  if (result && hadKey) { // 触发删除逻辑
    trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
  }
  return result
}

function has(target: object, key: string | symbol): boolean {
  const result = Reflect.has(target, key) // 看是否在目标中
  if (!isSymbol(key) || !builtInSymbols.has(key)) { // 内置symbol不进行收集
    track(target, TrackOpTypes.HAS, key)
  }
  return result
}

function ownKeys(target: object): (string | symbol)[] {
  track(target, TrackOpTypes.ITERATE, isArray(target) ? 'length' : ITERATE_KEY)
  return Reflect.ownKeys(target)
}

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty, // 绑定删除逻辑
  has,
  ownKeys
}

export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    if (__DEV__) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  },
  deleteProperty(target, key) {
    if (__DEV__) {
      console.warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  }
}

export const shallowReactiveHandlers = /*#__PURE__*/ extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
)

// Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.
export const shallowReadonlyHandlers = /*#__PURE__*/ extend(
  {},
  readonlyHandlers,
  {
    get: shallowReadonlyGet
  }
)
