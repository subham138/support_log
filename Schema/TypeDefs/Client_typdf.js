const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql");

const ClientTypeDf = new GraphQLObjectType({
    name: "client_df",
    fields: () => ({
        id: { type: GraphQLID },
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
		client_type: { type: GraphQLString },
		district_name: { type: GraphQLString },
		oprn_mode: { type: GraphQLString }
    })
})

const DistrictType = new GraphQLObjectType({
    name: "district_type",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString }
    })
})

module.exports = { ClientTypeDf, DistrictType }