const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const { GetMasterData } = require("../Modules/master_module");
const { masterTypeDf, clientTypeDf, tktStatusTypeDf, oprnModeTypeDf, priorityModeTypeDf, moduleTypeTypeDf } = require("../TypeDefs/Master_typdf");


const get_master_data = {
    type: new GraphQLList(masterTypeDf),
    args: { id: { type: GraphQLString }, db_type: { type: GraphQLInt } },
    async resolve(parent, args) {
        var result = await GetMasterData(args);
        return result;
    }
}

const get_client_type_data = {
    type: new GraphQLList(clientTypeDf),
    args: { id: { type: GraphQLString }, db_type: { type: GraphQLInt } },
    async resolve(parent, args) {
        var result = await GetMasterData(args);
        return result;
    }
}

const get_oprn_mode_data = {
    type: new GraphQLList(oprnModeTypeDf),
    args: { id: { type: GraphQLString }, db_type: { type: GraphQLInt } },
    async resolve(parent, args) {
        var result = await GetMasterData(args);
        return result;
    }
}

const get_tkt_status_data = {
    type: new GraphQLList(tktStatusTypeDf),
    args: { id: { type: GraphQLString }, db_type: { type: GraphQLInt } },
    async resolve(parent, args) {
        var result = await GetMasterData(args);
        return result;
    }
}

const get_priotity_mode_data = {
    type: new GraphQLList(priorityModeTypeDf),
    args: { id: { type: GraphQLString }, db_type: { type: GraphQLInt } },
    async resolve(parent, args) {
        var result = await GetMasterData(args);
        return result;
    }
}

const get_module_type_data = {
    type: new GraphQLList(moduleTypeTypeDf),
    args: { id: { type: GraphQLString }, db_type: { type: GraphQLInt } },
    async resolve(parent, args) {
        var result = await GetMasterData(args);
        return result;
    }
}

module.exports = { get_master_data, get_client_type_data, get_tkt_status_data, get_oprn_mode_data, get_priotity_mode_data, get_module_type_data };