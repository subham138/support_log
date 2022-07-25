const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString } = require("graphql");

const openedClosedTktType = new GraphQLObjectType({
    name: 'open_close_tkt',
    fields: () => ({
        opened: { type: GraphQLInt },
        closed: { type: GraphQLInt }
    })
})

const CloseTktType = new GraphQLObjectType({
    name: 'close_tkt',
    fields: () => ({
        today: { type: GraphQLInt },
        yesterday: { type: GraphQLInt },
        this_month: { type: GraphQLInt },
        last_month: { type: GraphQLInt },
        this_year: { type: GraphQLInt },
        lifetime: { type: GraphQLInt }
    })
})

const CloseTktByStatusType = new GraphQLObjectType({
    name: 'close_tkt_by_status',
    fields: () => ({
        tkt_status: { type: GraphQLString },
        status: { type: GraphQLInt }
        // par: { type: GraphQLInt },
        // temp: { type: GraphQLInt },
        // delay: { type: GraphQLInt },
        // working: { type: GraphQLInt },
        // work_pen: { type: GraphQLInt },
        // dis: { type: GraphQLInt },
        // delivered: { type: GraphQLInt },
        // sugg_giv: { type: GraphQLInt },
        // net_con_prob: { type: GraphQLInt },
        // ph_not_rec: { type: GraphQLInt },
        // deli_pend: { type: GraphQLInt },
        // hard_prob: { type: GraphQLInt },
        // off_clos: { type: GraphQLInt },
        // ph_nt_rech: { type: GraphQLInt },
        // clnt_call_twm: { type: GraphQLInt },
        // wrn_num: { type: GraphQLInt },
        // clnt_solv_prob: { type: GraphQLInt },
        // ph_busy: { type: GraphQLInt },
        // ml_ned: { type: GraphQLInt }
    })
})

const WorkDoneType = new GraphQLObjectType({
    name: 'work_done',
    fields: () => ({
        done: { type: GraphQLInt },
        emp_name: { type: GraphQLString }
    })
})

const TotalTktByDateType = new GraphQLObjectType({
    name: 'total_tkt_by_date',
    fields: () => ({
        no_tkt: { type: GraphQLInt },
        date_name: { type: GraphQLString }
    })
})

const TotalTktByClientType = new GraphQLObjectType({
    name: 'total_tkt_by_client',
    fields: () => ({
        total_tkt: { type: GraphQLInt },
        client_type: { type: GraphQLString }
    })
})

module.exports = { openedClosedTktType, CloseTktType, CloseTktByStatusType, WorkDoneType, TotalTktByDateType, TotalTktByClientType };