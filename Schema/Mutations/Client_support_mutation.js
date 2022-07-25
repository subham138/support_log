const { GraphQLString, GraphQLInt } = require("graphql");
const { GraphQLUpload } = require("graphql-upload");
const { ClientTktSave, ClientUploadFile, ClientTktUpdate } = require("../Modules/client_support_module");
const { MessageType } = require("../TypeDefs/Messages");

const client_tkt_save = {
    type: MessageType,
    args: {
        client_id: { type: GraphQLString },
        tkt_module: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        email: { type: GraphQLString },
        priority_status: { type: GraphQLString },
        prob_reported: { type: GraphQLString },
        name: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await ClientTktSave(args);
        return result;
    }
}

const client_tkt_up_file = {
    type: MessageType,
    args: {
        user_id: { type: GraphQLString },
        id: { type: GraphQLString },
        image: { type: GraphQLUpload }
    },
    async resolve(parent, args) {
        var data = await ClientUploadFile(args);
        return data;
    }
}

const client_tkt_update = {
    type: MessageType,
    args: {
        client_id: { type: GraphQLString },
        tkt_module: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        email: { type: GraphQLString },
        priority_status: { type: GraphQLString },
        prob_reported: { type: GraphQLString },
        name: { type: GraphQLString },
        user_id: { type: GraphQLString },
        id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await ClientTktUpdate(args);
        return result;
    }
}

module.exports = { client_tkt_save, client_tkt_up_file, client_tkt_update };