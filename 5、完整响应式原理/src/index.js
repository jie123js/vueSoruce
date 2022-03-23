import { _initMax } from "./init";
import { lifeCycleMixin } from "./lifecycle";
import { renderMixin } from "./render";
//todo new Vue的时候先做一个初始化操作_init,但是需要先在实例的prototype上挂一个_init方法,这个步骤在_initMax中实现
function Vue(options) {
  debugger;
  this._init(options);
}
_initMax(Vue);
renderMixin(Vue);
lifeCycleMixin(Vue);
export default Vue;
