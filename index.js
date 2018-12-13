
require('dotenv').config();

var SlackBot = require("slackbots");
var schedule = require('node-schedule');

var SlackGroup = require("./slack-group");

const config = require ("./config");

var bot = new SlackBot({
    token: process.env.BOT_TOKEN,
    name: config.bot_name
});

bot.on("start", function () {
    console.log("Bot Started Successfully");
});

var group;

async function main() {

    group = new SlackGroup({
        config : config,
        bot: bot,
        name: config.channel_name
    });

    schedule.scheduleJob(config.notification.start_getting_status_time, function(){
        group.startGettingStatus();
    });

    schedule.scheduleJob(config.notification.first_notification_time, function(){
        group.sendRemindersToNotCompletedUsers();
    });

    schedule.scheduleJob(config.notification.second_notification_time, function(){
        group.sendRemindersToNotCompletedUsers();
    });

    schedule.scheduleJob(config.notification.publish_missing_people_notification_time, function(){
        group.publishCurrentUsersStatus(false);
    });

    schedule.scheduleJob(config.notification.third_notification_time, function(){
        group.sendRemindersToNotCompletedUsers();
    });

    schedule.scheduleJob(config.notification.publish_missing_people_notification_reset_time, function(){
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

