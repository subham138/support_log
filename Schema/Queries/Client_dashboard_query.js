const { GraphQLList, GraphQLID, GraphQLString, GraphQLInt } = require("graphql");
const { ClientGetTktDashboard, ClientMonthlySupport, ClientOpenCloseTkt, ClientLastTkt } = require("../Modules/client_dashboard_model");
const { TotalTktByDateType, openedClosedTktType } = require("../TypeDefs/Dashboard_typdf");
const { SupportLogTypDf } = require("../TypeDefs/support_log_typdf");

const client_get_tkt_dashboard = {
    type: new GraphQLList(SupportLogTypDf),
    args: {
        id: { type: GraphQLString },
        client_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await ClientGetTktDashboard(args);
        return result;
    }
}

const client_open_close_tkt = {
    type: new GraphQLList(openedClosedTktType),
    args: {
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await ClientOpenCloseTkt(args);
        return result;
    }
}

const client_monthly_support = {
    type: new GraphQLList(TotalTktByDateType),
    args: {
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = ClientMonthlySupport(args);
        return result;
    }
}

const client_last_tkt = {
    type: new GraphQLList(SupportLogTypDf),
    args: {
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await ClientLastTkt(args);
        return result;
    }
}
module.exports = { client_get_tkt_dashboard, client_monthly_support, client_open_close_tkt, client_last_tkt };