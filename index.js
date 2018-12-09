
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

async function main() {
    let group = await createGroup(process.env.BOT_GROUP_NAME);
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

// bot.postMessageToGroup(
//     'manfacture-app',
//     'ezayak ya 3am app',
//     {
//     //    as_user: true,
//         username : "Ramy Feteha"
//     //     icon_url : "https://secure.gravatar.com/avatar/7b18e7e39bfa62fa8d899086d9567bba.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0003-32.png"
//     }
//     );



bot.on("message", function (data) {

    //console.log("new message recieved:", data);
    if (data.type !== "message") {
        return;
    }

    handleMessage(data.text);
});




function handleMessage(message) {
    switch (message) {
        case "hi":
        case "hello":
            sendGreeting();
            break;
        default:
            return;
    }
}


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