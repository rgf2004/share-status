var StateMachine = require('javascript-state-machine');

class User {
    constructor(name) {
        this.name = name;
        this._fsm();
    }

    speack() {
        console.log(`my name is ${this.name} and my state is ${this.state}`);
    }
}

StateMachine.factory(User,
    {
        init: 'init',
        transitions: [
            { name: 'step', from: 'init', to: 'q1-sent' },
            { name: 'step', from: 'q1-sent', to: 'q1-answered' },
            { name: 'step', from: 'q1-answered', to: 'q2-sent' },
            { name: 'step', from: 'q2-sent', to: 'q2-answered' },
            { name: 'step', from: 'q2-answered', to: 'q3-sent' },
            { name: 'step', from: 'q3-sent', to: 'q3-answered' },
            { name: 'step', from: 'q3-answered', to: 'completed' },
            { name: 'reset', from: '*', to: 'init' }            
        ],
        methods: {
            onQ1Sent : function () { console.log(`${this.name} has entered ${this.state} state`)},
            onQ1Answered : function () { console.log(`${this.name} has entered ${this.state} state`)},
            onQ2Sent : function () { console.log(`${this.name} has entered ${this.state} state`)},
            onQ2Answered : function () { console.log(`${this.name} has entered ${this.state} state`)},
            onQ3Sent : function () { console.log(`${this.name} has entered ${this.state} state`)},
            onQ3Answered : function () { console.log(`${this.name} has entered ${this.state} state`)},
            onCompleted : function () { console.log(`${this.name} has entered ${this.state} state`)},
            onReset : function () { console.log(`${this.name} has entered ${this.state} state`)}

        }
    });

var pop = new User('pop');
var mark = new User('mark');

 pop.speack();

 pop.step();
 pop.step();
 pop.step();
 pop.step();
 pop.step();
 pop.step();
 pop.step();
 pop.reset();

// pop.speack();

// pop.step();

// pop.speack();

// mark.speack();

//console.log(pop);