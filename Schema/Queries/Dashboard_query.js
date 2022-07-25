const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const { OpenCloseTkt, CloseTkt, WorkDone, TotalTktByDate, OpenTktByStatus, TotalTktByClint } = require("../Modules/dashboard_module");
const { openedClosedTktType, CloseTktType, CloseTktByStatusType, WorkDoneType, TotalTktByDateType, TotalTktByClientType } = require("../TypeDefs/Dashboard_typdf");

const open_close_tkt = {
    type: new GraphQLList(openedClosedTktType),
    args: {
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await OpenCloseTkt(args);
        return result;
    }
}

const close_tkt = {
    type: new GraphQLList(CloseTktType),
    args: {
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = CloseTkt(args);
        return result;
    }
}

const open_tkt_by_status = {
    type: new GraphQLList(CloseTktByStatusType),
    args: {
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = OpenTktByStatus(args);
        return result;
    }
}

const work_done = {
    type: new GraphQLList(WorkDoneType),
    args: {
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = WorkDone(args);
        return result;
    }
}

const total_tkt_by_date = {
    type: new GraphQLList(TotalTktByDateType),
    args: {
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = TotalTktByDate(args);
        return result;
    }
}

const total_tkt_by_client = {
    type: new GraphQLList(TotalTktByClientType),
    args: {
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = TotalTktByClint(args);
        return result;
    }
}

module.exports = { open_close_tkt, close_tkt, open_tkt_by_status, work_done, total_tkt_by_date, total_tkt_by_client };