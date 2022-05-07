import { isObject } from "@vue/shared";
import { trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

export const ref = (value) => {
  return new RefImpl(value);
};
function toReactive(value){
  return isObject(value)?reactive(value):value
}
class RefImpl{
  public _value
  public dep = new Set()
  constructor(public rawValue){
      this._value = toReactive(rawValue)
  }
  get value(){
    trackEffects(this.dep)
    return this._value
  }
  set value(newValue){
    if(newValue!==this._value){
      this._value = toReactive(newValue)
      this.rawValue = newValue
      triggerEffects(this.dep)
    }
  }

}
