import { createApp } from 'vue'
import App from './App.vue'

// import { createPinia } from 'pinia';
import { createPinia } from '@/pinia';



const app = createApp(App);

const pinia = createPinia()


pinia.use(function({store}){
   let local = localStorage.getItem('STATE');
    if(local){
        store.$state = JSON.parse(local);
    }
   store.$subscribe((mutation,state)=>{
    localStorage.setItem('STATE',JSON.stringify(state))
   })
})

app.use(pinia) // plugin.install 方法

app.mount('#app')




// render(h(App),'#app')

// vuex 缺点：ts兼容性不好   命名空间的缺陷（只能有一个store）    mutation和action的区别

// pinia 优点：ts兼容性好    不需要命名空间（可以创建多个store）  mutation删掉了  （状态、计算属性、动作）
// 大小也会更小巧一些




