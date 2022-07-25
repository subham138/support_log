const { GraphQLString, GraphQLID, GraphQLInt, GraphQLFloat } = require("graphql");
const { MasterInsertData, MasterUpdateData, MasterDeleteData } = require("../Modules/master_module");
const { MessageType } = require("../TypeDefs/Messages");

const create_master_data = {
    type: MessageType,
    args: {
        name: { type: GraphQLString },
        user_id: { type: GraphQLString },
        db_type: { type: GraphQLInt }
    },
    async resolve(parent, args) {
        var status = await MasterInsertData(args);
        return status;
    }
}

const update_master_data = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        user_id: { type: GraphQLString },
        db_type: {type: GraphQLInt}
    },
    async resolve(parent, args) {
        var status = await MasterUpdateData(args);
        return status;
    }
}

const delete_master_data = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        db_type: { type: GraphQLInt }
    },
    async resolve(parent, args) {
        var status = await MasterDeleteData(args);
        return status;
    }
}

module.exports = { create_master_data, update_master_data, delete_master_data };