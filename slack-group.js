var SlackUser = require("./slack-user");

class SlackGroup {

    constructor(params) {
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
                            bot: this.bot,
                            group_name : this.name,
                            id: member
                        }));
                    });                    
                }
            );
    }

    startGettingStatus() {
        
        this.cleanMembersFromBots();

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
}

module.exports = SlackGroup;