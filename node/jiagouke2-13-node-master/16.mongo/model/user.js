const mongoose = require('mongoose');
const crypto = require('crypto')
const UserSchema = mongoose.Schema({
    username:{ // 像组件传递的属性 有属性校验
        type:String,
        lowercase:true,
        required:true
    },
    password:{
        type:String,
        validate:{
            validator(value){
                return value.length > 6
            }
        }
    },
    gender:{
        type:Number,
        enum:[0,1],
        default:0
    },
    age:{
        type:Number,
        default:0,
        min:0,
        max:120
    },
    birthday:{
        type:Date,
        default:Date.now // 插入数据的时候的时间
    }
},{
    timestamps:{ // 可以用于鉴别用户啥时候创建，识别是不是老用户
        createAt:'createAt',
        updateAt:'updateAt'
    }
});

function plugin(Schema,options){
    Schema.statics.findByName = function(username,options={}){
        return this.findOne({username},options)
    }
    Schema.methods.saveMd5 = function(password){
        this.password = crypto.createHash('md5').update(password).digest('base64');
        return this.save()
    }
    Schema.pre('save',function(next){
        // 通用的钩子
        setTimeout(()=>{
            next(); // 可以控制是否向下执行
        },500)
    })
}
UserSchema.plugin(plugin,{a:1,b:2,c:3}); // vue.use()

// 骨架有了 要有一个模型，包装骨架的 
module.exports = mongoose.model('User',UserSchema,'user'); // 默认集合的名字采用的是小写+s



