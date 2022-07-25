const { GraphQLString } = require("graphql");
const { SupLogEntry, UpdateAssignTkt, UpdateDeliverTkt, UpdateRaiseTkt, DeleteTkt, UpdateTktStatus, UpdateAssignEng } = require("../Modules/support_log_module");
const { MessageType } = require("../TypeDefs/Messages");


const create_tkt = {
    type: MessageType,
    args: {
        client_id: { type: GraphQLString },
        tkt_module: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        priority_status: { type: GraphQLString },
        prob_reported: { type: GraphQLString },
        remarks: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var status = await SupLogEntry(args);
        return status;
    }
}

const update_raise_tkt = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        tkt_module: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        priority_status: { type: GraphQLString },
        prob_reported: { type: GraphQLString },
        remarks: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await UpdateRaiseTkt(args);
        return result;
    }
}

const update_tkt_status = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        user_id: { type: GraphQLString },
        tkt_status: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await UpdateTktStatus(args);
        return result;
    }
}

const update_assign_eng = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        assign_engg: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await UpdateAssignEng(args);
        return result;
    }
}

const update_assign_tkt = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        assign_engg: { type: GraphQLString },
        prob_reported: { type: GraphQLString },
        remarks: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await UpdateAssignTkt(args);
        return result;
    }
}

const update_deliver_tkt = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        call_attend: { type: GraphQLString },
        delivery: { type: GraphQLString },
        tkt_status: { type: GraphQLString },
        prob_reported: { type: GraphQLString },
        remarks: { type: GraphQLString },
		work_status: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await UpdateDeliverTkt(args);
        return result;
    }
}

const delete_tkt = {
    type: MessageType,
    args: {
        id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await DeleteTkt(args);
        return result;
    }
}

module.exports = { create_tkt, update_assign_tkt, update_deliver_tkt, update_raise_tkt, delete_tkt, update_tkt_status, update_assign_eng };