import ts from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import path from 'path'
export default {
    input: 'src/index.ts',
    output: {
        file: path.resolve(__dirname, 'dist/bundle.js'),
        format: 'iife',
        sourcemap: true // 开启sourcemap 源码映射
    },
    plugins: [
        ts(), // 这里使用ts 但是ts得有自己的规则 
        nodeResolve()
    ]
}