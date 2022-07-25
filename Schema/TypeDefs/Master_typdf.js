const { GraphQLObjectType, GraphQLString, GraphQLID } = require("graphql");

const masterTypeDf = new GraphQLObjectType({
    name: 'masterData',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString }
    })
})

const clientTypeDf = new GraphQLObjectType({
    name: 'clientTypeData',
    fields: () => ({
        client_id: { type: GraphQLID },
        client_type: { type: GraphQLString }
    })
})

const oprnModeTypeDf = new GraphQLObjectType({
    name: 'oprnModeData',
    fields: () => ({
        oprn_id: { type: GraphQLID },
        oprn_mode: { type: GraphQLString }
    })
})

const tktStatusTypeDf = new GraphQLObjectType({
    name: 'tktStatusData',
    fields: () => ({
        tkt_id: { type: GraphQLID },
        tkt_status: { type: GraphQLString }
    })
})

const priorityModeTypeDf = new GraphQLObjectType({
    name: 'priorityModeData',
    fields: () => ({
        priority_id: { type: GraphQLID },
        priority_mode: { type: GraphQLString }
    })
})

const moduleTypeTypeDf = new GraphQLObjectType({
    name: 'moduleTypeData',
    fields: () => ({
        module_id: { type: GraphQLID },
        module_type: { type: GraphQLString }
    })
})

module.exports = { masterTypeDf, clientTypeDf, oprnModeTypeDf, tktStatusTypeDf, priorityModeTypeDf, moduleTypeTypeDf };