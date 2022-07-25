const { GraphQLList, GraphQLID, GraphQLString, GraphQLInt } = require("graphql");
const { GetClient, GetDistrict } = require("../Modules/client_module");
const { ClientTypeDf, DistrictType } = require("../TypeDefs/Client_typdf");


const get_client = {
    type: new GraphQLList(ClientTypeDf),
    args: { id: { type: GraphQLString }, active: { type: GraphQLString } },
    async resolve(parent, args) {
        var status = await GetClient(args);
        return status;
    }
}

const get_district = {
    type: new GraphQLList(DistrictType),
    async resolve(parent, args) {
        var status = await GetDistrict();
        return status;
    }
}

module.exports = { get_client, get_district };