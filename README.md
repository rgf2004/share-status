# share-status

This is a proof of concept for making a bot helping in collecting team memebers' status, something simliar to **geekbot** https://geekbot.com/

Its main functionality is making asynchronous standup meetings in Slack by asking the team's members about their status and publish it on a channel so all members know others' status

#### The Current implmented Questions:
*  What did you do since yesterday?
*  What will you do today?
*  Anything blocking your progress?
*  Planned & Actual delivery Date for Task

### The following are prerequisites for runnig the bot
*  Node: 8.9 or higher
*  npm: v5.x

### Steps for Running the application
*  get a slack token by creating a new slack bot  https://my.slack.com/services/new/bot
*  rename dotenv file to be .env file and add the token value
*  create a private channel in your slack workspace 
*  update the **config.json** file, `channel_name` attribute by the name of this private channel.
*  customize the bot as you need for example bot name, time for notifications, ...etc
*  run the app using command `node ./index.js `

### This is just an initial boot and it still needs a lot of features, for example:
*  Build a front end user friendly control panel
*  Add functionality of customizing the questions.
*  Add functionality of customizing the notification behaviour and messages.
*  localization.
*  Dockerize it


### Credit, used libraries 
*  slackbots : https://www.npmjs.com/package/slackbots
*  dotenv : https://www.npmjs.com/package/dotenv
*  node-schedule : https://www.npmjs.com/package/node-schedule
*  javascript-state-machine : https://www.npmjs.com/package/javascript-state-machine

