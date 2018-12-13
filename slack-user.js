var StateMachine = require('javascript-state-machine');

class SlackUser {

    constructor(params) {
        this.config = params.config;
        this.bot = params.bot;
        this.group_name = params.group_name;
        this.id = params.id;
        this.messages = {};

        this._fsm();

        this
            .bot
            .getUserById(this.id)
            .then(user => {
                this.name = user.name;
                this.real_name = user.real_name;
                this.is_bot = user.is_bot;
            });
    }


    sendRemainder() {
        let msg =
        `:bell: Hello *${this.real_name}* :wave: remember to let the team know what you are up to.`;
        this.bot.postMessageToUser(this.name, msg);
    }

}

StateMachine.factory(SlackUser,
    {
        init: 'init',
        transitions: [
            { name: 'step', from: 'init', to: 'q1-sent' },
            { name: 'step', from: 'q1-sent', to: 'q2-sent' },           
            { name: 'step', from: 'q2-sent', to: 'q3-sent' },            
            { name: 'step', from: 'q3-sent', to: 'q4-sent' },
            { name: 'step', from: 'q4-sent', to: 'completed' },
            { name: 'reset', from: '*', to: 'init' }
        ],
        methods: {
            onQ1Sent: function () {

                let msg =
`Hello *${this.real_name}*! It's time for our standup meeting *${this.config.meeting_name}*. When you are ready please answer the following question:
What did you do since yesterday?`
;
                this.bot.postMessageToUser(this.name, msg);
            },
            onQ2Sent: function (lifecycle, answer) {
                this.messages.q1 = answer.text;
                
                let msg = `What will you do today?`;
                this.bot.postMessageToUser(this.name, msg);
            },           
            onQ3Sent: function (lifecycle, answer) { 
                
                this.messages.q2 = answer.text;
                
                let msg = `Anything blocking your progress?`;
                this.bot.postMessageToUser(this.name, msg);                
            },
            onQ4Sent: function (lifecycle, answer) { 
                
                this.messages.q3 = answer.text;
                
                let msg = `Planned & Actual delivery Date for Task`;
                this.bot.postMessageToUser(this.name, msg);                
            },
            onCompleted: function (lifecycle, answer) { 
                
                this.messages.q4 = answer.text;
               
                let msg = 
`*${this.real_name}* posted an update for *${this.group_name}*
*What did you do since yesterday?*
${this.messages.q1}
*What will you do today?*
${this.messages.q2}
*Anything blocking your progress?*
${this.messages.q3}
*Planned & Actual delivery Date for Task*
${this.messages.q4}
`;

                this.bot.postMessageToGroup(
                    this.group_name,
                    msg,
                    {
                        username: this.real_name
                    }
                );

                let finalMessage = `Thank you! Have fun :the_horns:`

                this.bot.postMessageToUser(this.name, finalMessage);  
                
            },
            onReset: function () { console.log(`${this.name} has entered ${this.state} state`) }

        }
    });

module.exports = SlackUser;