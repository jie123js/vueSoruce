<template>
  <div class="box">
    <li v-for="(i, index) in list" :key="index">
      <img v-my-lazy="i" />
    </li>
  </div>
</template>

<script>
import VueLazyload from "./J-vue-lazyload.js";
import Vue from "vue";
import logo from "@/assets/logo.png";
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: logo,
});
export default {
  data() {
    return { list: [] };
  },
  mounted() {
    let img =
      "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
    var p = Promise.resolve([
      img,
      img,
      img,
      img,
      img,
      img,
      img,
      img,
      img,
      img,
      img,
      img,
      img,
    ]);
    let _this = this;
    p.then(function(v) {
      _this.list = v; // 1
    });

    // this.list = [
    //   img,
    //   img,
    //   img,
    //   img,
    //   img,
    //   img,
    //   img,
    //   img,
    //   img,
    //   img,
    //   img,
    //   img,
    //   img,
    // ];
    // fetch('http://localhost:4000/api/list').then((response)=>response.json()).then(json=>{
    //     this.list = json;
    // })
  },
};

// 别人在开发组件的时候 import Vue from 'vue'; Vue.directive()  -> 包2.4
// 我的项目 -》 包 2.5 -> Vue-> Vue.directive()

// Vue.use = function(plugin,options){
//     if(typeof plugin === 'function'){
//         plugin(this,options);
//     }else{
//         plugin.install(this,options);
//     }
// }
// 所以在写插件的时候 我们会采用Vue.use的方法进行扩展
</script>

<style scoped lang="scss">
.box {
  width: 400px;
  height: 400px;
  overflow-y: scroll;
  img {
    width: 100px;
    height: 100px;
  }
}
</style>
