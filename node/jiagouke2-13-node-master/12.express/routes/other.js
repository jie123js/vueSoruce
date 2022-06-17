const express = require('../express');
const router = express.Router();

router.get('/get',function(req,res){
    res.end('user add get')
})

module.exports = router