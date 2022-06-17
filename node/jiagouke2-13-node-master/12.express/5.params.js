// vuw2 react-router 带参数路由

const express = require('./express');
const app = express();


app.get('/school/:name/:num',function(req,res){
    res.end(JSON.stringify(req.params))
})
app.listen(3000,function(){
    console.log(`server start 3000`);
})
// let keys = []
// let [,...args] = ('/school/zf/13').match( pathToRegExp('/school/:name/:num',keys))
// console.log(args,keys.map(item=>item.name))
// const configPath = '/school/:name/:num'; 

// let regStr = configPath.replace(/:([^\/]+)/g,function(){
//     console.log(arguments[1])
//     return '([^\/]+)'
// })
// console.log(new RegExp(regStr))

// let reg = ('/school/zf/13').match(new RegExp(regStr))
// console.log(reg)
// 