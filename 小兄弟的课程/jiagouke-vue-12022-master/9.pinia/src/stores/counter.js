import { defineStore } from "@/pinia";
// import { defineStore } from "pinia";
import {computed, reactive, toRefs} from 'vue'

export const useCounterStore = defineStore('counter',{
    state:()=> ({count:1,fruits:['香蕉','苹果']}),
    getters: {
        doubleCount:(store)=>store.count * 2 // 计算属性
    },
    actions:{
        increment(){ // 同步异步都在action中来处理
            // return new Promise((resolve,reject)=>{
            //     setTimeout(()=>{
            //         resolve('123')
            //     },1000)
            // })
            this.count++
        }
    }
})


// export const useCounterStore = defineStore({
//     id:'counter',
//     state:()=> ({count:0}),
//     getters: {
//         doubleCount:(store)=>store.count * 2 // 计算属性
//     },
//     actions:{
//         increment(){ // 同步异步都在action中来处理
//             this.count++
//         }
//     }
// })



// export const useCounterStore = defineStore('counter',()=>{ // 传递一个setup函数

//     const state = reactive({count:0})

//     const doubleCount = computed(()=> state.count*2);

//     const increment = () => state.count++;

//     // store.state
//     return {...toRefs(state),doubleCount,increment}

// })

// 我们有多个store  多个store 也要有一个统一管理 
// $pinia