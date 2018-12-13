var SlackUser = require("./slack-user");

class SlackGroup {

    constructor(params) {
        this.config = params.config;
        this.bot = params.bot;
        this.name = params.name;
        this.members = [];

        this
            .bot
            .getGroup(this.name)
            .then(
                groupData => {
                    this.id = groupData.id;

                    groupData.members.forEach(member => {
                        this.members.push(new SlackUser({
                            config : this.config,
                            bot: this.bot,
                            group_name : this.name,
                            id: member
                        }));
                    });                    
                },
                error => {
                    console.log(error);
                    console.log(`Error: Publish channel [${this.name}] doesn't exist or the bot is not a member`);
                    process.exit(1);
                }
            );

        
        setTimeout(() => {
            this.cleanMembersFromBots();  
        }, 5000);
    }

    addUser(data) {

        this.members.push(new SlackUser({
            bot: this.bot,
            group_name : this.name,
            id: data.user
        }));
    
    }

    startGettingStatus() {      
        this.members.forEach(member => {
            member.step();
        });
    }

    handleIncommingMessage(msg){
        let member = this.members.find(memebr => msg.user === memebr.id);
        member.step(msg);
    }

    cleanMembersFromBots() {
        let filteredMemebers = this.members.filter(member => member.is_bot != true);
        this.members = filteredMemebers;
    }

    sendRemindersToNotCompletedUsers() {
        let filteredMemebers = this.getNotFinishedUsers();
        filteredMemebers.forEach(member => member.sendRemainder());
    }

    publishCurrentUsersStatus(resetState) {

        let filteredMemebers = this.getNotFinishedUsers();

        if (filteredMemebers.length > 0) {
            let msg = "*User(s) haven't sent their status :* \n";
            filteredMemebers.forEach(member => {
                msg = msg + `*:arrow_right:\t${member.real_name}* \n`;
                if (resetState)
                    member.reset();
            });

            this.bot.postMessageToGroup(
                this.name,
                msg
            );
        }        
    }

    getNotFinishedUsers() {
        return this.members.filter(member => member.state != "completed");
    }

}

module.exports = SlackGroup;