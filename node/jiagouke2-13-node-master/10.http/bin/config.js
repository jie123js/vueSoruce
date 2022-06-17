module.exports = {
    'port':{
        option:'-p,--port <number>',
        description:'server port number',
        default:8080,
        usage:'zs --port <number>'
    },
    'directory':{
        option:'-d,--directory <name>',
        description:'server directory',
        default:process.cwd(),
        usage:'zs --directory d:'
    }
}