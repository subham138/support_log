const { GraphQLString } = require("graphql");
const { MessageType } = require("../TypeDefs/Messages");
const { SaveHoliday } = require("../Modules/holiday_model");

const create_holiday = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        evnt_date: { type: GraphQLString },
        event: { type: GraphQLString },
        code_no: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var status = await SaveHoliday(args);
        return status;
    }
}

module.exports = { create_holiday };