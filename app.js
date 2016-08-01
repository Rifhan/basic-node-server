'use strict';

require("babel-core/register");
const app = require('express')();
const twitter = require('twit')(require('./config/auth'));
const hashTags = require('./config/hashtags');
const query = {
    q : hashTags.hashTags,
    count : 3,
    result_type : "recent"
}
/*
    Retweets anything with the included in the hashtags.js file
*/
//TODO : Deploy in heroku OR Azure and Integrate with Travis CI, implement error handling with email notifications
function tweetBot(){
    twitter.get('search/tweets',query,(error,data) => {
        if(!error){
            console.log(data);
            // tweetID = data.statuses[0].id_str;
            twitter.post('statuses/retweet/'+data.statuses[0].id_str,{ },(error,response) => {
                if(response){
                    console.log("success");
                }else{
                    console.log("error retweeting");
                }
            });
        }else{
            console.log("Error");
            console.log(error);
        }
    });
}
// 1000 * 60 * 30 = 30 mins
setInterval(() => {
   tweetBot();
},1000 * 60 * 30);
app.get('/',(req,res) => {
    res.status(200).json({
        "status" : "App Running",
        "name" : "snowy the bot",
        "description" : "This is a twitter bot"
    });
})