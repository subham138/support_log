const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        user_id: { type: GraphQLString },
        password: { type: GraphQLString },
        code_no: { type: GraphQLInt },
        user_type: { type: GraphQLString },
        login_status: { type: GraphQLString },
        approval_flag: { type: GraphQLString },
        user_status: { type: GraphQLString },
        user_name: { type: GraphQLString },
        image: { type: GraphQLString }
    }),
})

const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: { type: GraphQLID },
        user_type: { type: GraphQLString },
        emp_code: { type: GraphQLString },
        emp_name: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        email: { type: GraphQLString },
        emp_designation: { type: GraphQLString },
        remarks: { type: GraphQLString },
        client_name: { type: GraphQLString },
        district_id: { type: GraphQLString },
        client_type_id: { type: GraphQLString },
        oprn_mode_id: { type: GraphQLString },
        client_addr: { type: GraphQLString },
        working_hrs: { type: GraphQLString },
        amc_upto: { type: GraphQLString },
        rental_upto: { type: GraphQLString },
        image: { type: GraphQLString }
    }),
})

module.exports = { UserType, ProfileType };