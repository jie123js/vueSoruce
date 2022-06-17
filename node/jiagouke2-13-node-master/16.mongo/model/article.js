
const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
    },
    title:String,
    content:String,
    editTime:{
        type:Date,
        default: Date.now
    },
    cate_id:{ // 文章对应的分类是谁
        type:mongoose.SchemaTypes.ObjectId,
    }
})

module.exports = mongoose.model('Article',ArticleSchema,'article')