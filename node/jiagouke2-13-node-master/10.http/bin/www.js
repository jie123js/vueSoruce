#! /usr/bin/env node




const config = require('./config');
const { Command } = require('commander');
const program = new Command();
program
    .name("zs")
    .usage("[path] [options]")
let usageList = []
Object.entries(config).forEach(([key, value]) => {
    usageList.push(value.usage);
    program
        .option(value.option, value.description, value.default)
})

program.on('--help', () => {
    console.log('\nExamples:')
    usageList.forEach(item => console.log('  ' + item ))
})

program.parse(process.argv);
const Server = require('../src/server');
new Server(program.opts()).start();

// 这里负责解析命令行参数
