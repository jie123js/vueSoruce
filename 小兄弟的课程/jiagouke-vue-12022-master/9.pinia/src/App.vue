<script>
import { useCounterStore } from './stores/counter';
import { mapActions, mapState,mapWritableState} from '@/pinia'
export default {
  computed:{
    ...mapWritableState(useCounterStore,['count']), // optionsAPI  => {count:'count'} mapHelpers
    ...mapWritableState(useCounterStore,{f:'fruits'}),
    ...mapWritableState(useCounterStore,['doubleCount']), 
  },
  methods:{
     ...mapActions(useCounterStore,['increment'])
  }
}
</script>

<template>
  <!-- const store = reactive({}) -->
  计数器:{{ count }} <br>
  水果:{{ f}} <br>

  {{doubleCount}}

  <button @click="count++">点击</button>  
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

