const { GraphQLList, GraphQLID, GraphQLString } = require("graphql");
const { GetEmpData, GetEngList } = require("../Modules/emp_master_module");
const { empMasterType } = require("../TypeDefs/Emp_master");


const get_emp = {
    type: new GraphQLList(empMasterType),
    args: { id: { type: GraphQLString } },
    async resolve(parent, args) {
        var status = await GetEmpData(args);
        return status;
    }
}

const get_eng_list = {
    type: new GraphQLList(empMasterType),
    async resolve(parent, args) {
        var status = await GetEngList(args);
        return status;
    }
}

module.exports = { get_emp, get_eng_list };