'use strict';

require("babel-core/register");

const express = require('express');
const app = express();
const retweet = require('./twitter_api/tweets');
const scheduler = require('node-schedule');
const morning = new scheduler.RecurrenceRule();
const eve = new scheduler.RecurrenceRule();
const MORN_TWEET = 1;
const EVE_TWEET = 0;

var resultMorning = "";
var resultEve = "";
// 1000 * 60 * 14 = 15 mins
morning.dayOfWeek = [0,new scheduler.Range(0,6)];
morning.hour = 3;
morning.minute = 30;

eve.dayOfWeek = [0,new scheduler.Range(0,6)];
eve.hour = 20;
eve.minute = 16;


resultMorning = scheduler.scheduleJob(morning, ()=>{
    retweet.tweetTrendingHashtags(MORN_TWEET);
});

resultEve = scheduler.scheduleJob(eve,()=>{
    retweet.tweetTrendingHashtags(EVE_TWEET);
})

scheduler.scheduleJob("*/15 * * * *",()=>{
    retweet.retweetBot();
});

app.use(express.static('public'));

//app.use('/tweet',retweet());
app.get('/',(req,res) => {
    res.sendFile('./public/index.html');
})

app.listen(process.env.PORT || 3000, () =>{
    console.log("server is running");
});