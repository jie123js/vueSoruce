import { nextTick } from "../utils";

let queue = []; //这里存放要更新的watcher
let has = {}; //原来存续已有的watcher的id
let pending = false;
function flushSchedulerQueue() {
  queue.forEach((watcher) => watcher.run());
  queue = [];
  has = {};
  pending = false;
}
export function queneWatcher(watcher) {
  //watcher1 watcher1 watcher1 watcher2(放多个watcher1只有第一个会放进去,但是那为什么页面会更新最后一个watcher1的值那 因为这里只是执行渲染到页面的逻辑,值已经在set中改过了)

  //一般情况下 写去重可以采用这个方式,如果不使用set的shih
  let id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    queue.push(watcher);

    if (!pending) {
      //防抖
      nextTick(flushSchedulerQueue);
      pending = true;
    }
  }
}
