
const mongoose = require('mongoose');

const CateSchema = mongoose.Schema({
    title: String,
})

module.exports = mongoose.model('Cate', CateSchema, 'cate')