const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql");

const holidayType = new GraphQLObjectType({
    name: 'holiday',
    fields: () => ({
        id: { type: GraphQLID },
        evnt_date: { type: GraphQLString },
        event: { type: GraphQLString }
    })
})

module.exports = { holidayType };