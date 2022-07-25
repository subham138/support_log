const { GraphQLObjectType, GraphQLString } = require("graphql");

const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: () => ({
        success: { type: GraphQLString },
        message: { type: GraphQLString }
    })
})

module.exports = { MessageType }