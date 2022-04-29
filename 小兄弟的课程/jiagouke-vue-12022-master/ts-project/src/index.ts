// 例如引入了一个jquery   他没有用ts

// 希望能用人家的 但是不报错

// import a from './1.png'

import vue from 'a.vue'


import $ from 'jquery' // 这个可以通过module来声明一个模块， 但是一般使用jquery， cdn上  script src


$().css('a', 'b')

$.fn.extend()

let b: X = {
    a: '123'
}

let a = new String();

a.xxx();

window.store

Role.admin

// 如果自己写了用自己的 可以配置是否使用
// 默认查找.d.ts   查找范围 ， 默认引入一个包会查找node_modules 对应的同名包找 这个包下的package.json types
// 如果不是用ts来写的 @types 下的包

export let a1: number = 1;
export let b2: string = '1';

interface X {

}
export class My implements X {

}

export { }