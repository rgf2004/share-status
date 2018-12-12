
require('dotenv').config();

var SlackBot = require("slackbots");
var schedule = require('node-schedule');

var SlackGroup = require("./slack-group");

var bot = new SlackBot({
    token: process.env.BOT_TOKEN,
    name: process.env.BOT_NAME
});

bot.on("start", function () {
    //bot.postMessageToChannel(groupName, "Share-Status is online!");
    console.log("Bot Started Successfully");
});

var group;

async function main() {

    group = new SlackGroup({
        bot: bot,
        name: process.env.BOT_GROUP_NAME
    });

    //wait till getting users data, need to find a better solution
    setTimeout(() => {
        group.cleanMembersFromBots();  
    }, 2000);
    
    let sendGreetingTime        = '45 12 * * *';
    let sendFirstRemainderTime  = '50 12 * * *';
    let sendSecondRemainderTime = '55 12 * * *';
    let publishNotSentUserTime  = '00 13 * * *';
    let sendThirdRemainderTime  = '05 13 * * *';
    let resetUserTime           = '10 13 * * *';


    var sendRequestForStatus = schedule.scheduleJob(sendGreetingTime, function(){
        group.startGettingStatus();
    });
  
    var sendRemaindersToNotCompletedUSers = schedule.scheduleJob(sendFirstRemainderTime, function(){
        group.sendRemindersToNotCompletedUsers();
    });

    var sendSecondRemaindersToNotCompletedUSers = schedule.scheduleJob(sendSecondRemainderTime, function(){
        group.sendRemindersToNotCompletedUsers();
    });

    var publishCurrentUsersStatus = schedule.scheduleJob(publishNotSentUserTime, function(){
        group.publishCurrentUsersStatus(false);
    });

    var sendThirdRemaindersToNotCompletedUSers = schedule.scheduleJob(sendThirdRemainderTime, function(){
        group.sendRemindersToNotCompletedUsers();
    });

    var resetUsersStates = schedule.scheduleJob(resetUserTime, function(){
        group.publishCurrentUsersStatus(true);
    });
}

bot.on("message", function (data) {

    if (data.type === "message" && data.user && data.channel !== group.id) {
        group.handleIncommingMessage(data);
    }

    if (data.type === "member_joined_channel" && data.channel === group.id) {
        group.addUser(data);
    }
});


main();

