const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const { ClientGetTkt } = require("../Modules/client_support_module");
const { SupportLogTypDf } = require("../TypeDefs/support_log_typdf");

const client_get_tkt = {
    type: new GraphQLList(SupportLogTypDf),
    args: {
        id: { type: GraphQLString },
        client_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await ClientGetTkt(args);
        return result;
    }
}

module.exports = { client_get_tkt };