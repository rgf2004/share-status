class SlackUser {

    constructor(params) {
        this.id = params.id,
        this.name = params.name,
        this.real_name = params.real_name,
        this.messages = []
    }

}

module.exports = SlackUser;