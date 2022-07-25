const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql");


const SupportLogTypDf = new GraphQLObjectType({
    name: 'SupLogTypdf',
    fields: () => ({
        id: { type: GraphQLID },
        tkt_no: { type: GraphQLString },
        client_id: { type: GraphQLString },
        tkt_module: { type: GraphQLString },
        log_in: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        priority_status: { type: GraphQLString },
        call_attend: { type: GraphQLString },
        delivery: { type: GraphQLString },
        tkt_status: { type: GraphQLString },
        assign_engg: { type: GraphQLString },
        prob_reported: { type: GraphQLString },
        remarks: { type: GraphQLString },
        work_status: { type: GraphQLString },
        client_name: { type: GraphQLString },
        district_name: { type: GraphQLString },
        client_type: { type: GraphQLString },
        oprn_mode: { type: GraphQLString },
        working_hrs: { type: GraphQLString },
        amc_upto: { type: GraphQLString },
        rental_upto: { type: GraphQLString },
        priority: { type: GraphQLString },
        module: { type: GraphQLString },
        emp_name: { type: GraphQLString },
        tktStatus: { type: GraphQLString },
        client_addr: { type: GraphQLString },
        email: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        user_name: { type: GraphQLString },
        file_path: { type: GraphQLString },
        email_id: { type: GraphQLString },
        client_type_id: { type: GraphQLString },
        schema_name: { type: GraphQLString },
    })
})

module.exports = { SupportLogTypDf };