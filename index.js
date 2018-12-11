
require('dotenv').config();

var SlackBot = require("slackbots");

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

    // wait till getting users data, need to find a better solution
    setTimeout(() => {
        group.startGettingStatus();    
    }, 2000);
    
}

bot.on("message", function (data) {

    // if (data.type !== "message") {
    //     return;
    // }

    if (data.type == "message" && data.user && data.channel !== group.id) {
        group.handleIncommingMessage(data);
    }
});


main();



// bot.getChannels()
//     .then(
//         res => {
//             console.log("channels:")
//             var channels = res.channels;
//             channels.forEach(element => {
//                 console.log(element.id,"-->",element.name);
//             });
//         }
//     );


// bot.getUsers()
// .then(
//     res => {
//         console.log("members:")
//         var members = res.members;
//         members.forEach(element => {
//             console.log(element.id,"-->",element.name);
//         });
//     }
// );

// bot.getGroups()
// .then(
//     res => {
//         console.log("groups:")
//         var groups = res.groups;
//         groups.forEach(element => {
//             //console.log(element.id,"-->",element.name);
//             console.log(element);
//         });
//     }
// );











function sendGreeting() {
    var greeting = getGreeting();
    bot.postMessageToChannel(channel, greeting);
}


function getGreeting() {
    var greetings = [
        "hello!",
        "hi there!",
        "cheerio!",
        "how do you do!",
        "¡hola!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
}