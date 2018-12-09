
require('dotenv').config();

var SlackBot = require("slackbots");

var SlackGroup = require("./slack-group");
var SlackUser = require("./slack-user");

var bot = new SlackBot({
    token: process.env.BOT_TOKEN,
    name: process.env.BOT_NAME
});

async function getUserDetails(userId) {
    let user = await bot.getUserById(userId);
    return user;
}

async function getUsers(usersArray) {
    var users = [];
    for (var i = 0, len = usersArray.length; i < len; i++) {
        let member = await getUserDetails(usersArray[i]);
        if (!member.is_bot)
            users.push(new SlackUser(member));
    }
    return users;
}

async function getGroup(groupName) {
    var group = await bot.getGroup(groupName);
    return group;
}

async function createGroup(groupName) {

    let group = await getGroup(groupName);

    let users = await getUsers(group.members);

    let slackGroup = new SlackGroup({
        id: group.id,
        name: group.name,
        users: users
    });

    return slackGroup;
}

bot.on("start", function () {
    //bot.postMessageToChannel(groupName, "Share Status is online again");
    console.log("Bot Started Successfully");
});

var group;

async function main() {
    group = await createGroup(process.env.BOT_GROUP_NAME);

    let msg = "Hello Ramy! It's time for our standup meeting *MRC status*. When you are ready please answer the following question:\nWhat did you do since Thursday?"

    bot.postMessageToUser(group.users[0].name, msg);
}

bot.on("message", function (data) {

    // if (data.type !== "message") {
    //     return;
    // }

    if (data.type == "message" && data.user && data.channel !== group.id) {
        console.log("new message recieved:", data);
        handleMessage(data);
    }
});

function handleMessage(data) {

    var msg = "*Ramy Feteha* posted an update for *MRC status*\n" + data.text;

    bot.postMessageToGroup(
        group.name,
        msg,
        {
            username: group.users[0].real_name
        }
    );
}


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