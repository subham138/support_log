const { GraphQLString, GraphQLInt } = require("graphql");
const { MessageType } = require("../TypeDefs/Messages");
const { empSave, emp_update, DeleteEmp } = require("../Modules/emp_master_module");

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

const update_emp = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        emp_code: { type: GraphQLInt },
        emp_name: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        email: { type: GraphQLString },
        emp_designation: { type: GraphQLString },
        remarks: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var status = await emp_update(args);
        return status;
    }
}

const delete_emp = {
    type: MessageType,
    args: { id: { type: GraphQLString } },
    async resolve(parent, args) {
        var status = await DeleteEmp(args);
        return (status);
    }
}

module.exports = { create_emp, update_emp, delete_emp };