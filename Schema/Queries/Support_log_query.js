const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const { SupLogGet, SearchByDate, SearchByTktNo, CheckTktNo, GetSupportLogDone, SearchByDateClient, SearchByDateEmp } = require("../Modules/support_log_module");
const { MessageType } = require("../TypeDefs/Messages");
const { SupportLogTypDf } = require("../TypeDefs/support_log_typdf");


const get_supp_log = {
    type: new GraphQLList(SupportLogTypDf),
    args: {
        id: { type: GraphQLString },
        tag: { type: GraphQLString },
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await SupLogGet(args);
        return result;
    }
}

const search_by_date = {
    type: new GraphQLList(SupportLogTypDf),
    args: {
        frm_dt: { type: GraphQLString },
        to_dt: { type: GraphQLString },
        user_id: { type: GraphQLString },
        user_type: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await SearchByDate(args);
        return result;
    }
}

const search_by_tkt_no = {
    type: new GraphQLList(SupportLogTypDf),
    args: {
        tkt_no: { type: GraphQLString },
        user_id: { type: GraphQLString },
        user_type: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await SearchByTktNo(args);
        return result;
    }
}

const search_by_date_client = {
    type: new GraphQLList(SupportLogTypDf),
    args: {
        frm_dt: { type: GraphQLString },
        to_dt: { type: GraphQLString },
        client_id: { type: GraphQLString },
        user_id: { type: GraphQLString },
        user_type: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await SearchByDateClient(args);
        return result;
    }
}

const search_by_date_employee = {
    type: new GraphQLList(SupportLogTypDf),
    args: {
        frm_dt: { type: GraphQLString },
        to_dt: { type: GraphQLString },
        emp_id: { type: GraphQLString },
        user_id: { type: GraphQLString },
        user_type: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await SearchByDateEmp(args);
        return result;
    }
}

const check_tkt_no = {
    type: MessageType,
    args: {
        tkt_no: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await CheckTktNo(args);
        return result;
    }
}

const get_supp_log_done = {
    type: new GraphQLList(SupportLogTypDf),
    args: {
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await GetSupportLogDone(args);
        return result;
    }
}

module.exports = { get_supp_log, search_by_date, search_by_tkt_no, check_tkt_no, get_supp_log_done, search_by_date_client, search_by_date_employee };