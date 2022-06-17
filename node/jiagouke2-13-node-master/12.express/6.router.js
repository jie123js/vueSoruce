

const express = require('./express');

const app = express();
const user = require('./routes/user');
const other = require('./routes/other');

const manager = require('./routes/manager');

// user / manager === express.Router() === function(req,res,next){}
app.use('/user',user)    
app.use('/user',other)   // /get
app.use('/manager',manager)

app.listen(3000, function () {
    console.log('server start 3000')
})

app.use(function(err,req,res,next){
    res.end(err)
})


// 我有一个管理的模块  还有一个用户的模块 ， 两个人路由分组