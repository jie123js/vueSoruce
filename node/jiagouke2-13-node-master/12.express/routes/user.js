const express = require('../express');
const router = express.Router();

router.get('/add',function(req,res){
    res.end('user add')
})
router.get('/remove',function(req,res,next){
    // res.end('user remove')
    console.log('next')
    next('eror')
})

module.exports = router