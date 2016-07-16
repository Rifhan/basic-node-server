'use strict';

require("babel-core/register");
var express = require('express');
var app = express();
var auth = require('./api/auth');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/auth',auth());

app.listen(3000, () =>{
    console.log("server is running");
});