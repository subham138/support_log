const { GraphQLList, printError, GraphQLString } = require('graphql')
const { UserType, ProfileType } = require('../TypeDefs/User')
const db = require('../db');
const { UserLogin, CheckUser, GetUserDetails, GetUserDetailsById, CheckEmail, GetProfileDtls } = require('../Modules/user_module');
const { MessageType } = require('../TypeDefs/Messages');

const user_login = {
    type: MessageType,
    args: { user_id: { type: GraphQLString }, password: { type: GraphQLString } },
    async resolve(parent, args) {
        const status = await UserLogin(args);
        // console.log(status);
        return status;
    }
}

const check_user = {
    type: MessageType,
    args: { code_no: { type: GraphQLString } },
    async resolve(parent, args) {
        const status = await CheckUser(args);
        // console.log(status);
        return status;
    }
}

const get_user_details = {
    type: new GraphQLList(UserType),
    args: { tag: { type: GraphQLString } },
    async resolve(parent, args) {
        const result = await GetUserDetails(args);
        return result;
    }
}

const get_user_details_by_id = {
    type: new GraphQLList(UserType),
    args: { user_email: { type: GraphQLString } },
    async resolve(parent, args) {
        const result = await GetUserDetailsById(args);
        return result;
    }
}

const check_email = {
    type: MessageType,
    args: { email_id: { type: GraphQLString } },
    async resolve(parent, args) {
        const result = await CheckEmail(args);
        return result;
    }
}

const get_profile_dtls = {
    type: new GraphQLList(ProfileType),
    args: {
        user_email: { type: GraphQLString },
        user_type: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await GetProfileDtls(args);
        return result;
    }
}

module.exports = { user_login, check_user, get_user_details, get_user_details_by_id, check_email, get_profile_dtls };