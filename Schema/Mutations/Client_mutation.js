const { GraphQLString, GraphQLInt } = require("graphql");
const { CheckClient, UpdateClient, DeleteClient } = require("../Modules/client_module");
const { MessageType } = require("../TypeDefs/Messages");

const create_client = {
    type: MessageType,
    args: {
        client_name: { type: GraphQLString },
        district_id: { type: GraphQLString },
        client_type_id: { type: GraphQLString },
        oprn_mode_id: { type: GraphQLString },
        client_addr: { type: GraphQLString },
        tech_person: { type: GraphQLString },
        tech_designation: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        email: { type: GraphQLString },
        working_hrs: { type: GraphQLString },
        support_mode: { type: GraphQLString },
        amc_upto: { type: GraphQLString },
        rental_upto: { type: GraphQLString },
        support_status: { type: GraphQLString },
        schema_name: { type: GraphQLString },
        remarks: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var status = await CheckClient(args);
        return status;
    }
}

const update_client = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        client_name: { type: GraphQLString },
        district_id: { type: GraphQLString },
        client_type_id: { type: GraphQLString },
        oprn_mode_id: { type: GraphQLString },
        client_addr: { type: GraphQLString },
        tech_person: { type: GraphQLString },
        tech_designation: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        email: { type: GraphQLString },
        working_hrs: { type: GraphQLString },
        support_mode: { type: GraphQLString },
        amc_upto: { type: GraphQLString },
        rental_upto: { type: GraphQLString },
        support_status: { type: GraphQLString },
        schema_name: { type: GraphQLString },
        remarks: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var status = await UpdateClient(args);
        return status;
    }
}

const delete_client = {
    type: MessageType,
    args: { id: { type: GraphQLString } },
    async resolve(parent, args) {
        var status = await DeleteClient(args);
        return status;
    }
}

module.exports = { create_client, update_client, delete_client };