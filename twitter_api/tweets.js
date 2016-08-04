'use strict';

const router = require('express').Router();
const mailer = require('../config/mail');
const twitter = require('twit')(require('../config/auth'));
const hashTags = require('../config/hashtags');
const query = {
    q : hashTags.hashTags,
    count : 3,
    result_type : "recent"
}
const sortBy = require('sort-by');
const sampleData = require('./sample');
const statements = require('../config/tweet');
const validator = require('validator');

/*Retweets hashtags specified in the hashtags.js file*/
module.exports.retweetBot = function() {
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
            mailer("rifhan.akram1@gmail.com","Snowy Twitter Error",error,"").then(function(success){
                
            },function(error){
                 console.log("Error");
            });
        }
    });
}

module.exports.tweetTrendingHashtags = function(type){
    var trendingData = "";
    var currentDay = new Date().getDay();
    var tweetStr = statements.statements[currentDay].update;
    if(type == 1){
       tweetStr = statements.statements[currentDay].message;
    }
    console.log(statements.woeid); 
    twitter.get('trends/place',{id : statements.woeid},(error,data) => {
        if(!error){
            //write sorting algo to include object with only english names to the array of objects
            trendingData = data[0].trends.sort(sortBy('-tweet_volume'));
            for(var i = 0 ; i < statements.noOfTweets ; i++){
                if(validator.contains(trendingData[i].name,"#")){
                    tweetStr += `${trendingData[i].name} ` 
                }else{
                    tweetStr += ` #${trendingData[i].name} ` 
                }       
            
            }
            twitter.post('statuses/update',{status:tweetStr},(error,response) => {
                if(!error){
                    if(response){
                         mailer("rifhan.akram1@gmail.com","Snowy daily tweet",response.text,"").then(function(success){
                            
                        },function(error){
                            console.log("Error");
                        });
                    }
                }else{
                    mailer("rifhan.akram1@gmail.com","Snowy Twitter Error",error,"").then(function(success){
                
                    },function(error){
                        console.log("Error");
                    });
                }
            });
        }else{
            console.log(error);
        }
    });  
}

