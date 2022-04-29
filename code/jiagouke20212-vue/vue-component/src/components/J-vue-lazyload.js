let VueLazyload = {
  install(Vue, userOptions) {
    let LazyClass = lazy(Vue);
    let instance = new LazyClass(userOptions);
    Vue.directive("myLazy", {
      bind: instance.add.bind(instance),
      unbind: instance.unbind,
    });
  },
};

function getScrollParent(el) {
  let parent = el.parentNode;
  while (parent) {
    if (/(scroll)|(auto)/.test(getComputedStyle(parent)["overflow"])) {
      return parent;
    }
    parent = parent.parentNode;
  }
  return parent;
}
function lazy(Vue) {
  function render(imgListener, status) {
    let el = imgListener.el;
    console.log(el);
    switch (status) {
      case "loading":
        el.src = imgListener.options.loading;
        break;
      case "loaded":
        el.src = imgListener.src;
        break;
      case "error":
        el.src = imgListener.options.error;
        break;
      default:
        break;
    }
  }
  function loadImg(src) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  }
  class ReactiveListener {
    constructor(el, src, options) {
      this.el = el;
      this.src = src;
      this.options = options;
      this.state = { loading: false }; //用于判断图片的加载状态
    }
    checkInView() {
      //监测在不在页面中
      let { top } = this.el.getBoundingClientRect();

      return top < window.innerHeight * this.options.preLoad;
    }
    load() {
      //如果在页面中需要加载
      render(this, "loading");
      loadImg(this.src)
        .then(() => {
          this.state.loading = true;
          render(this, "loaded");
        })
        .catch(() => {
          this.state.loading = true;
          render(this, "error");
        });
    }
  }
  return class LazyClass {
    constructor(userOptions) {
      this.options = userOptions;
      this.hasScroll = false;

      this.queue = [];
    }
    lazyloadHandler() {
      // console.log(this.queue);
      this.queue.forEach((imgListener) => {
        if (imgListener.state.loading === true) return;

        imgListener.checkInView() && imgListener.load();
      });
    }
    add(el, dirs, vnode) {
      //我们需要拿到父节点但是有可能为空,解决方法nexttick或者把指令的bind改成insert
      Vue.nextTick(() => {
        let imgListener = new ReactiveListener(el, dirs.value, this.options);
        this.queue.push(imgListener);

        let ele = getScrollParent(el);
        if (!this.hasScroll) {
          ele.addEventListener("scroll", this.lazyloadHandler.bind(this), {
            passive: true,
          });
          this.hasScroll = true;
        }
        this.lazyloadHandler();
      });
    }
    unbind() {}
  };
}
export default VueLazyload;
