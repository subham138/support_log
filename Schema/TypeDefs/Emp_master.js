const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString } = require("graphql");

const empMasterType = new GraphQLObjectType({
    name: 'emp_master',
    fields: () => ({
        id: { type: GraphQLID },
        emp_code: { type: GraphQLInt },
        emp_name: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        email: { type: GraphQLString },
        emp_designation: { type: GraphQLString },
        remarks: { type: GraphQLString },
        user_type: { type: GraphQLString }
    })
})

module.exports = { empMasterType };