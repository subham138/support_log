const { GraphQLString, GraphQLInt } = require("graphql");
const { MessageType } = require("../TypeDefs/Messages");
const { empSave } = require("../Modules/emp_master_module");

const create_emp = {
    type: MessageType,
    args: {
        emp_code: { type: GraphQLInt },
        emp_name: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        email: { type: GraphQLString },
        emp_designation: { type: GraphQLString },
        remarks: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var status = await empSave(args);
        return status;
    }
}

module.exports = { create_emp };