const bcrypt = require('bcrypt');
const dateFormat = require('dateformat');
const nodemailer = require('nodemailer');
const Buffer = require('buffer').Buffer;
const db = require('../db');
const path = require('path');
const fs = require('fs');
let data = {};

const insert = (args) => {
    const { code_no, user_type, user_id, password } = args;
    return new Promise(async (resolve, reject) => {
        const pass = bcrypt.hashSync(password, 10);
        var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var approval_flag = user_type != 'C' ? 'U' : 'A';
        let sql = `INSERT INTO md_users (user_id, password, code_no, user_type, approval_flag, user_status, created_by, created_dt) VALUES ("${user_id}", "${pass}", "${code_no}", "${user_type}", "A", "A", "${code_no}", "${datetime}")`;
        db.query(sql, async (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                //data = { success: 0, message: 'Data Not Inserted' };
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                // await send_email(user_id);
                data = { success: 1, message: 'User created successfully.' };
            }
            resolve(data);
        })
    })
}

const InsertUser = (args) => {
    const { code_no, user_type, user_id, password } = args;
    return new Promise(async (resolve, reject) => {
        //let data = '';
        //let check_user_sql = `SELECT * FROM md_users WHERE user_type = "${user_type}" AND code_no = "${code_no}"`;
        let check_user_sql = `SELECT * FROM md_users WHERE code_no = "${code_no}" AND user_type = "${user_type}"`;
        await db.query(check_user_sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { success: 0, message: 'Something Went Wrong' };
            }
            if (result.length > 0) {
                data = { success: 2, message: 'Data Already Exist' };
            } else {
                data = await insert(args);
            }
            resolve(data);
        })
    })
}

const UserLogin = (args) => {
    const { user_id, password } = args;
    return new Promise((resolve, reject) => {
        let status = '1';
        let sql = `SELECT a.*, IF(a.user_type = 'C', c.client_name, b.emp_name)as emp_name FROM md_users a LEFT JOIN md_employee b ON a.code_no=b.emp_code LEFT JOIN md_client c ON a.code_no=c.id WHERE a.user_id = "${user_id}" AND a.user_status="A" AND a.approval_flag = 'A'`;
        db.query(sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { success: 0, message: 'Something Went Wrong' };
            }
            if (result.length > 0) {
                if (await bcrypt.compare(password, result[0].password)) {
                    var day = dateFormat(new Date(), "dddd");
                    if (day == 'Sunday') {
                        dayActiveFlag = 'N';
                        result[0]['activeDayFlag'] = dayActiveFlag;
                    } else {
                        var chk_dt = await checkActiveDate();
                        dayActiveFlag = chk_dt ? 'N' : 'Y';
                        result[0]['activeDayFlag'] = dayActiveFlag;
                    }
                    await UpdateLoginStatus(args, status);
                    data = { success: 1, message: JSON.stringify(result) };
                } else {
                    data = { success: 0, message: 'Please Check Your User ID Or Password' }
                }
            } else {
                data = { success: 0, message: 'User Is Deactivated Or No Data Found' };
            }
            // console.log(result[0].password);
            resolve(data);
        });
    })
}

const checkActiveDate = () => { 
    return new Promise((resolve, reject) => { 
        var sql = `SELECT count(id) chk_dt FROM md_holiday WHERE evnt_date = "${dateFormat(new Date(), "yyyy-mm-dd")}"`;
        var data = false
        db.query(sql, (err, result) => { 
            if (err) { 
                console.log(err);
                data = false;
            } else if(result[0].chk_dt > 0) { 
                data = true;
            } else { 
                data = false;
            }
            resolve(data);
        });
    });
}

const UpdateLoginStatus = (args, status) => {
    const { user_id } = args;
    var sql = `UPDATE md_users SET login_status = "${status}" WHERE user_id = "${user_id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: 'Something Went Wrong' };
            } else {
                data = { success: 1, message: 'Data Updated' };
            }
            resolve(data);
        })
    })
}

const CheckUser = (args) => {
    const { code_no } = args;
    //let sql = `SELECT emp_name as name, email, phone_no FROM md_employee WHERE emp_code = ${code_no}`;
    let sql = `SELECT a.emp_name as name, a.email, a.phone_no, IF(b.id>0, b.id, 0) as log_done FROM md_employee a LEFT JOIN md_users b ON a.emp_code=b.code_no WHERE a.emp_code = "${code_no}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { console.log({ msg: err }); data = { success: 0, message: JSON.stringify(err) }; }
            if (result.length > 0) {
                if (result[0].log_done > 0) {
                    data = { success: 2, message: JSON.stringify(result) };
                } else {
                    data = { success: 1, message: JSON.stringify(result) };
                }

            } else {
                data = { success: 0, message: 'No Data Found.. Please Contact With Admin' };
            }
            resolve(data);
        })
    })
}

const GetUserDetails = (args) => {
    const { tag } = args;
    var tag_val = tag == '1' ? 'A' : 'D';
    var active = tag == '1' ? `WHERE a.user_status = "${tag_val}"` : (tag == '0' ? `WHERE a.user_status = "${tag_val}"` : '');
    var sql = `SELECT a.*, b.emp_name as user_name FROM md_users a JOIN md_employee b ON a.code_no = b.emp_code ${active}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}

const UpdateUserType = (args) => {
    const { id, user_type, user_id } = args;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE md_users SET user_type = "${user_type}", modified_by = "${user_id}", modified_dt = "${datetime}" WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Updated Successfully !!' };
            }
            resolve(data);
        })
    })
}

const UpdateUserStatus = (args) => {
    const { id, user_status, user_id } = args;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE md_users SET user_status = "${user_status}", modified_by = "${user_id}", modified_dt = "${datetime}" WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Updated Successfully !!' };
            }
            resolve(data);
        })
    })
}

const GetUserDetailsById = (args) => {
    const { user_email } = args;
    var sql = `SELECT * FROM md_users WHERE user_id="${user_email}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}

const send_email = async (email_id) => {
    let email_en = Buffer.from(email_id).toString('base64');
    var transporter = nodemailer.createTransport({
        host: 'webmail.synergicportal.in',
        port: 25,
        secure: false,
        auth: {
            user: 'admin@synergicportal.in',
            pass: 'Support!sSs#2021'
        },
        tls: { rejectUnauthorized: false }
    });
    var mailOptions = {
        from: 'admin@synergicportal.in',
        to: email_id,
        subject: 'SynergicPortal',
        html: '<!doctype html>'
            + '<html>'
            + '<head>'
            + '<meta charset="utf-8">'
            + '<title>HomeworkHelp</title>'
            + '<style type="text/css">body{font - size: 14px; color: #494949; font-size: 15px; margin: 0; padding: 0;}</style>'
            + '</head>'
            + '<body>'
            + '<div style="max-width: 830px; margin: 0 auto; padding: 0 15px;">'
            + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
            + '<tbody>'
            + '<tr>'
            + '<td align="left" valign="top" style="text-align: center; padding: 14px 0; border-bottom: #ef3e36 solid 3px;"><img src="https://support.synergicportal.in/assets/Login_assets/images/logo.png" width="171" height="43" alt="" /></td>'
            + '</tr>'
            + '<tr>'
            + '<td align="left" valign="top" style="padding: 25px 15px 5px 15px; font-family: Arial; font-size: 15px; line-height: 25px;">'
            + '<p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;">Please <a href="https://support.synergicportal.in/#/template?id=' + email_en + '">click here</a> to activate your account.</p>'
            + '</td>'
            + '</tr>'
            + '</tbody>'
            + '</table>'
            + '</div>'
            + '</body>'
            + '</html>'
    };
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        console.log('Email sent: ' + info.response);
    })
}

const UpdateApprovalFlag = (args) => {
    const { email_id } = args;
    var email = Buffer.from(email_id, 'base64').toString('ascii');
    var sql = `UPDATE md_users SET approval_flag='A' WHERE user_id = '${email}'`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Successfully Approved!!!' };
            }
            resolve(data);
        })
    })
}

const CheckEmail = (args) => {
    const { email_id } = args;
    var sql = `SELECT * FROM md_users WHERE user_id = "${email_id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } if (result.length > 0) {
                data = { success: 1, message: 'Email Exist' };
            } else {
                data = { success: 0, message: 'Email ID Is Not Registered' };
            }
            resolve(data);
        })
    })
}

const ForgotPassword = (args) => {
    const { email_id } = args;
    var password = 'password';
    const pass = bcrypt.hashSync(password, 10);
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE md_users SET password = "${pass}", modified_by = "${email_id}", modified_dt = "${datetime}" WHERE user_id = "${email_id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                // FOR LOCAL
                // var transporter = nodemailer.createTransport({
                //     service: 'gmail',
                //     auth: {
                //         user: 'synergicbbps@gmail.com',
                //         pass: 'Signature@123'
                //     }
                // });

                // FOR SERVER

                // var transporter = nodemailer.createTransport({
                //     host: 'webmail.synergicportal.in',
                //     port: 25,
                //     secure: false,
                //     auth: {
                //         user: 'admin@synergicportal.in',
                //         pass: 'Support!sSs#2021'
                //     },
                //     tls: { rejectUnauthorized: false }
                // });
                // var mailOptions = {
                //     from: 'admin@synergicportal.in',
                //     to: email_id,
                //     subject: 'SynergicPortal',
                //     html: '<!doctype html>'
                //         + '<html>'
                //         + '<head>'
                //         + '<meta charset="utf-8">'
                //         + '<title>HomeworkHelp</title>'
                //         + '<style type="text/css">body{font - size: 14px; color: #494949; font-size: 15px; margin: 0; padding: 0;}</style>'
                //         + '</head>'
                //         + '<body>'
                //         + '<div style="max-width: 830px; margin: 0 auto; padding: 0 15px;">'
                //         + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                //         + '<tbody>'
                //         + '<tr>'
                //         + '<td align="left" valign="top" style="text-align: center; padding: 14px 0; border-bottom: #ef3e36 solid 3px;"><img src="https://support.synergicportal.in/assets/Login_assets/images/logo.png" width="171" height="43" alt="" /></td>'
                //         + '</tr>'
                //         + '<tr>'
                //         + '<td align="left" valign="top" style="padding: 25px 15px 5px 15px; font-family: Arial; font-size: 15px; line-height: 25px;">'
                //         + '<center><p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;"><span style="color: #2fd025;">Your Password Reseted Successsfully..</span></p></center>'
                //         + '<p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;">Please try to login with new password <b><i>"password"</i></b>.</p>'
                //         + '<p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;"><b><small><i><span style="color: #d02525; font-size: 11px;">PLEASE RESET YOUR PASSWORD AFTER LOGIN, FOR SECURITY PURPOSE.</span></i></small></b></p>'
                //         + '</td>'
                //         + '</tr>'
                //         + '</tbody>'
                //         + '</table>'
                //         + '</div>'
                //         + '</body>'
                //         + '</html>'
                // };
                // await transporter.sendMail(mailOptions, (error, info) => {
                //     if (error) console.log(error);
                //     console.log('Email sent: ' + info.response);
                // })
                data = { success: 1, message: 'Please try to login with new password as "password"' };
            }
            resolve(data);
        })
    })
}

const ResetPassword = (args) => {
    const { password, user_email } = args;
    const pass = bcrypt.hashSync(password, 10);
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE md_users SET password = "${pass}", modified_by = "${user_email}", modified_dt = "${datetime}" WHERE user_id = "${user_email}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Password Updated Successfully' };
            }
            resolve(data);
        })
    })
}

const GetProfileDtls = (args) => {
    const { user_email, user_type } = args;
    var join_cls = user_type != 'C' ? 'JOIN md_employee b ON a.code_no=b.emp_code' : 'JOIN md_client b ON a.code_no=b.id';
    var select = user_type != 'C' ? 'b.id, b.emp_name, b.phone_no, b.email, b.emp_designation, b.emp_code' : 'b.id, b.district_id, b.client_name, b.oprn_mode_id, b.client_type_id, b.client_addr, b.phone_no, b.email, b.working_hrs, b.amc_upto, b.rental_upto';
    var sql = `SELECT a.user_type, a.image, ${select} FROM md_users a ${join_cls} WHERE a.user_id = "${user_email}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
            }
            resolve(result);
        })
    })
}

const UpdateProfile = (args) => {
    const { id, phone_no, emp_name, designation, user_type, district_id, client_name, oprn_mode_id, client_type_id, client_addr, working_hrs } = args;
    var fields = user_type != 'C' ? `emp_name = "${emp_name}", phone_no = "${phone_no}", emp_designation = "${designation}"` : `district_id = "${district_id}", client_name = "${client_name}", oprn_mode_id = "${oprn_mode_id}", client_type_id = "${client_type_id}", client_addr = "${client_addr}", phone_no = "${phone_no}", working_hrs = "${working_hrs}"`;
    var column = user_type != 'C' ? 'emp_code' : 'id';
    var db_name = user_type != 'C' ? 'md_employee' : 'md_client';
    var sql = `UPDATE ${db_name} SET ${fields} WHERE ${column} = "${id}"`;
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Updated Successfully' };
            }
            resolve(data)
        })
    })
}

// FILE

const storeFS = ({ stream, file_name }) => {
    const uploadDir = '../../assets/upload';
    const up_path = path.join(__dirname, `../../assets/upload/${file_name}`);
    console.log(up_path);
    return new Promise((resolve, reject) =>
        stream
            .on('error', error => {
                if (stream.truncated)
                    // delete the truncated file
                    fs.unlinkSync(up_path);
                reject(error);
            })
            .pipe(fs.createWriteStream(up_path))
            .on('error', error => reject(error))
            .on('finish', () => resolve({ up_path }))
    );
}

const UploadFile = async (args) => {
    const { user_id } = args;
    const { filename, mimetype, createReadStream } = await args.image;
    var arr = filename.split('.');
    var timestamp = new Date().getTime();
    let file_name = `${arr[0]}_${timestamp}.${arr[1]}`;
    console.log(file_name);
    const stream = createReadStream();

    const pathObj = await storeFS({ stream, file_name });
    const fileLocation = pathObj.up_path;
    console.log({ fileLocation });
    return new Promise((resolve, reject) => {
        var sql = `UPDATE md_users SET image = "${file_name}" WHERE user_id = "${user_id}"`;
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: file_name };
            }
            resolve(data)
        })
    })
    // var data = { message: filename, success: 1 };
    // console.log({ filename, mimetype, stream });
}

const RemoveImage = (arganys) => {
    const { user_id } = args;
    var sql = `UPDATE md_users SET image = NULL WHERE user_id = "${user_id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Updated Successfully' };
            }
            resolve(data)
        })
    })
}

module.exports = { InsertUser, UserLogin, CheckUser, GetUserDetails, UpdateUserType, UpdateUserStatus, GetUserDetailsById, UpdateApprovalFlag, CheckEmail, ForgotPassword, ResetPassword, GetProfileDtls, UpdateProfile, UpdateLoginStatus, UploadFile, RemoveImage };