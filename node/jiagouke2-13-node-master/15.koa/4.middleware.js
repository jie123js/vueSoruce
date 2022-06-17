const Koa = require('./koa'); 
const fs =require('fs')
const path = require('path')
const app = new Koa();
app.use((ctx)=>{
    // ctx.set('Content-Type','text/plain')
    ctx.res.setHeader('Content-Type','text/plain')
    ctx.body = fs.createReadStream(path.resolve(__dirname,'note.md'))
})
app.on('error',function(err,ctx){
   console.log(err)
})
app.listen(3000, () => {
    console.log('server start 3000');
})

