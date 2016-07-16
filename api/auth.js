'use strict';

var express = require('express');
var router = express.Router();

module.exports = function(){
    
    router.get('/sign', (req,res) => {
        console.log("hello");
    });

    return router;
}