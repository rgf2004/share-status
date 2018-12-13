# share-status

This is a proof of concept for making a bot simliar to **geekbot** https://geekbot.com/

# Steps for Running the application
*  get a slack token by creating a new slack bot  https://my.slack.com/services/new/bot
*  rename dotenv file to be .env file and add the token value
*  create a private channel in your slack workspace 
*  update the **config.json** file, `channel_name` attribute by the name of this private channel.
*  customize the bot as you need for example bot name, time for notifications, ...etc

## This is just an initial boot and it needs a lot of features, for example:
*  Build a front end user friendly control panel
*  Add functionality of customizing the questions.
*  Add functionality of customizing the notification behaviour and messages.
*  localization.


# Credit, used libraries 
*  slackbots : https://www.npmjs.com/package/slackbots
*  dotenv : https://www.npmjs.com/package/dotenv
*  node-schedule : https://www.npmjs.com/package/node-schedule
*  javascript-state-machine : https://www.npmjs.com/package/javascript-state-machine

