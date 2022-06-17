
const express = require('../express');

const router = express.Router();
router.get('/add',function(req,res){
    res.end('manager add')
})
router.get('/remove',function(req,res){
    res.end('manager remove')
})

module.exports = router;