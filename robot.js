
var Botkit = require('botkit');
var request = require('request');
var slackToken;
var controller = Botkit.slackbot({
    debug: false
});

if (process.env.SLACK_TOKEN == undefined || process.env.SLACK_TOKEN == null) {
    var Secret = require('./secret.js');
    slackToken = Secret.slackToken;
} else {
    slackToken = process.env.SLACK_TOKEN;
}

// connect the bot to a stream of messages
controller.spawn({
    token: slackToken
}).startRTM();

// give the bot something to listen for.
var randomCount =  function(min, mult){
    return (Math.round(Math.random()*mult)) + min;
};

var isWorkDay = function(currentTime){
    return currentTime.getDay() > 0 && currentTime.getDay() < 6;
};

var isWorkHour = function(currentTime) {
    return currentTime.getHours() >= 8 && currentTime.getHours() <= 18;
};

var isOnHour = function(currentTime){
    return currentTime.getMinutes() === 0;
};

controller.hears(['start', 'Start', 'I\'m ready!', 'Let\'s do this!'],['direct_message','direct_mention','mention'],function(bot,message) {

    bot.reply(message, "Get ready for your hourly workouts!");


    setInterval(function(){hourlyTimer()},60000);

    function hourlyTimer() {
        var currentTime = new Date();
        if(!isWorkDay(currentTime) || !isWorkHour(currentTime) || !isOnHour(currentTime)) {
            return;
        }

        var exercises = [
            "It's that time! Gimme " + randomCount(5, 10) + " squats!",
            "You'll never make progress unless you start!\nDo " + randomCount(5, 10) + " lunges",
            "Repetition makes perfect.\nDrop and do " + randomCount(5,10) + " donkey kicks.",
            "Channel your inner ballerina,\n" + randomCount(5, 10) + " calf raises",
            "Focus that core! Hold a plank for 30 seconds.",
            "Get those obliques! Hold a side plank for 30 secs on each side.",
            "You got this.\nDo " + randomCount(5,10) + " reverse crunches.",
            "Drop and give me " + randomCount(5,10) + " pushups",
            "Find something stable to use and do " + randomCount(5, 10) + " tricep dips",
            "Oh, look at the time! You don't even have to get up!\n Do " + randomCount(15, 30) + " seconds of arm circles."

        ];
        var rndNum = Math.round(Math.random()*8);

        bot.reply(message, exercises[rndNum]);

    }
});