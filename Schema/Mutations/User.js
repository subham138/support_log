const { GraphQLString, GraphQLID, GraphQLInt } = require("graphql");
const { GraphQLUpload } = require('graphql-upload');
const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const { UserType } = require("../TypeDefs/User");
const db = require('../db');
const { InsertUser, UpdateUserType, UpdateUserStatus, UpdateApprovalFlag, ForgotPassword, ResetPassword, UpdateProfile, UpdateLoginStatus, UploadFile, RemoveImage } = require('../Modules/user_module');
const { MessageType } = require('../TypeDefs/Messages');

const create_user = {
    type: MessageType,
    args: {
        code_no: { type: GraphQLString },
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var status = await InsertUser(args);
        return status;

    }
}

const update_user_type = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        user_type: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await UpdateUserType(args);
        return result;
    }
}

const update_user_status = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        user_status: { type: GraphQLString },
        user_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await UpdateUserStatus(args);
        return result;
    }
}

const update_approve_status = {
    type: MessageType,
    args: {
        email_id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await UpdateApprovalFlag(args);
        return result;
    }
}

const forgot_password = {
    type: MessageType,
    args: { email_id: { type: GraphQLString } },
    async resolve(parent, args) {
        var result = await ForgotPassword(args);
        return result;
    }
}

const reset_password = {
    type: MessageType,
    args: {
        password: { type: GraphQLString },
        user_email: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await ResetPassword(args);
        return result;
    }
}

const update_profile = {
    type: MessageType,
    args: {
        id: { type: GraphQLString },
        user_type: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        emp_name: { type: GraphQLString },
        designation: { type: GraphQLString },
        district_id: { type: GraphQLString },
        client_name: { type: GraphQLString },
        oprn_mode_id: { type: GraphQLString },
        client_type_id: { type: GraphQLString },
        client_addr: { type: GraphQLString },
        working_hrs: { type: GraphQLString }
    },
    async resolve(parent, args) {
        var result = await UpdateProfile(args);
        return result;
    }
}

const update_login_status = {
    type: MessageType,
    args: { user_id: { type: GraphQLString }, login_status: { type: GraphQLString } },
    async resolve(parent, args) {
        const { user_id, login_status } = args;
        var status = login_status;
        var result = await UpdateLoginStatus(args, status);
        return result;
    }
}

const update_user = {
    type: UserType,
    args: { id: { type: GraphQLID }, password: { type: GraphQLString } },
    async resolve(parent, args) {
        const { id, password } = args;
        const pass = bcrypt.hashSync(password, 10);
        var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        let sql = `UPDATE users SET password = "${pass}", updatedAt = "${datetime}" WHERE id = "${id}"`;
        console.log(sql);
        await db.query(sql, (err, result) => {
            if (err) console.log({ update_err: err });
            console.log(result);
        });
        return args;
    }
}

const delete_user = {
    type: UserType,
    args: {
        id: { type: GraphQLID }
    },
    async resolve(parent, args) {
        const { id } = args;
        let sql = `DELETE FROM users WHERE id = ${id}`;
        await db.query(sql, (err, lastId) => {
            if (err) console.log({ msg: err });

        })
        return 'Deleted Successfully';
    }
}

const upload_file = {
    type: MessageType,
    args: {
        user_id: { type: GraphQLString },
        image: { type: GraphQLUpload }
    },
    async resolve(parent, args) {
        var data = await UploadFile(args);
        // const { filename, mimetype, createReadStream } = await image;
        // const stream = createReadStream();
        // var data = { message: filename, success: 1 };
        // console.log({ filename, mimetype, stream });
        return data;
    }
}

const remove_image = {
    type: MessageType,
    args: { user_id: { type: GraphQLString } },
    async resolve(parent, args) {
        var result = await RemoveImage(args);
        return result;
    }
}

module.exports = { create_user, delete_user, update_user, update_user_type, update_user_status, update_approve_status, forgot_password, reset_password, update_profile, update_login_status, upload_file, remove_image };