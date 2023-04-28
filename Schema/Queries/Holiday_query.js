const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const { holidayType } = require("../TypeDefs/Holiday_typdf");
const { GetHoldayList } = require("../Modules/holiday_model");

const get_holiday_list = {
    type: new GraphQLList(holidayType),
    args: { id: { type: GraphQLString } },
    async resolve(parent, args) {
        var result = await GetHoldayList(args);
        return result;
    }
}

module.exports = { get_holiday_list };