<script>
import { useCounterStore } from './stores/counter';
import { mapState } from 'pinia'
export default {
  compunted:{
    ...mapState(useCounterStore,['count','fruits'])
  }
}

// const store = useCounterStore(); // 你的状态直接就放到了store上

// const { increment } = store;

// setTimeout(()=>{
//   store.$dispose();
// },1000)

// const handleClick = () => {
//   // store.$state = {count:100,fruits:[]}
//   //  store.count++; // type: 'direct'
//   // store.count++;
//   // let fruits = [...store.fruits, '橘子']
//   //  store.$patch({ // patch object
//   //    count: ++store.count,
//   //   //  fruits
//   //  })
//   // store.$patch(() => { // patch function
//   //   store.count++;
//   //    store.count++;
//   // })
//   // store.$reset(); // 重置状态
//   increment()
// }
// store.$subscribe((mutation,state)=>{ // 回调
//     console.log('数据变化',state,mutation);
// })
// store.$onAction(({after,onError,name})=>{ // 发布订阅
//   console.log('action执行了',name);

//   after((result)=>{
//     console.log('状态已经更新完毕了',result)
//   })
//   after((result)=>{
//     console.log('状态已经更新完毕了',result)
//   })
//   onError(()=>{
//     console.log('出错')
//   })
// })
</script>

<template>
  <!-- const store = reactive({}) -->
  计数器:{{ store.count }} <br>
  双倍:{{ store.doubleCount }} <br>

  <button @click="handleClick">点击增加</button>

  <div v-for="item in store.fruits" :key="item">
    {{ item }}
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
