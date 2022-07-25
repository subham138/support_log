const db = require('../db');
const dateFormat = require('dateformat');
const { GetTktNo } = require('./support_log_module');
var data = {};
var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
const Buffer = require('buffer').Buffer;
const path = require('path');
const fs = require('fs');

const ClientGetTkt = (args) => {
    var { client_id, id } = args;
    var whr_cls = id > 0 && id != '' ? `AND a.id = "${id}"` : 'AND a.work_status="0"';
    var sql = `SELECT a.*, b.client_name, c.district_name, d.client_type, e.oprn_mode, b.client_addr,
                b.rental_upto, b.working_hrs, b.rental_upto, f.module_type, g.tkt_status as tktStatus, h.emp_name, h.email
                FROM td_support_log a
                JOIN md_client b ON a.client_id=b.id
                JOIN md_district c ON b.district_id=c.id
                JOIN md_client_type d ON b.client_type_id=d.id
                JOIN md_oprn_mode e ON b.oprn_mode_id=e.id
                JOIN md_module f ON a.tkt_module=f.id
                LEFT JOIN md_tkt_status g ON a.tkt_status=g.id
                LEFT JOIN md_employee h ON a.assign_engg=h.emp_code
                WHERE a.client_id = "${client_id}" ${whr_cls}`; // AND a.work_status != '0'
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}

// const ClientTktSave = async (args) => {
//     const { client_id, tkt_module, phone_no, priority_status, prob_reported, remarks, user_id } = args;
//     const tkt_no = await GetTktNo();
//     const tmstamp = dateFormat(new Date(), "ddmmyy");
//     datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
//     var tkt = `L/${tmstamp}/${client_id}/${tkt_no[0].id}`;
//     var sql = `INSERT INTO td_support_log
//     (tkt_no, client_id, tkt_module, log_in, phone_no, priority_status, prob_reported, remarks, created_by, created_dt)
//      VALUES ("${tkt}", "${client_id}", "${tkt_module}", "${datetime}", "${phone_no}", "${priority_status}",
//      "${prob_reported}", "${remarks}", "${user_id}", "${datetime}")`;
//     return new Promise((resolve, reject) => {
//         db.query(sql, (err, lastId) => {
//             if (err) {
//                 console.log({ msg: err });
//                 data = { success: 0, message: JSON.stringify(err) };
//             } else {
//                 data = { success: 1, message: 'Insert Successfully !!' };
//             }
//             resolve(data);
//         })
//     })
// }

const storeFS = ({ stream, file_name }) => {
    const uploadDir = '../../assets/logUploads';
    const up_path = path.join(__dirname, `../../assets/logUploads/${file_name}`);
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

const ClientUploadFile = async (args) => {
    const { user_id, id } = args;
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
        var sql = `UPDATE td_support_log SET file_path = "logUploads/${file_name}" WHERE id = "${id}"`;
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: file_name };
            }
            resolve(data)
        })
    })
}

const ClientTktSave = async (args) => {
    const { client_id, tkt_module, phone_no, email, priority_status, prob_reported, name, user_id } = args;
    var fileLocation = ''
    return new Promise(async (resolve, reject) => {
        const tkt_no = await GetTktNo();
        const tmstamp = dateFormat(new Date(), "ddmmyy");
        datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var tkt = `L/${tmstamp}/${client_id}/${tkt_no[0].id}`;
        var sql = `INSERT INTO td_support_log
        (tkt_no, client_id, tkt_module, log_in, phone_no, email_id, user_name, priority_status, prob_reported, created_by, created_dt)
        VALUES ("${tkt}", "${client_id}", "${tkt_module}", "${datetime}", "${phone_no}", "${email}", "${name}", "${priority_status}",
        "${prob_reported}", "${user_id}", "${datetime}")`;
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: JSON.stringify(lastId) };
            }
            resolve(data)
        })
    })
}

const ClientTktUpdate = async (args) => {
    const { id, client_id, tkt_module, phone_no, email, priority_status, prob_reported, name, user_id } = args;
    return new Promise(async (resolve, reject) => {
        datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var sql = `UPDATE td_support_log SET tkt_module = "${tkt_module}", phone_no = "${phone_no}",  email_id = "${email}", user_name = "${name}", prob_reported = "${prob_reported}", modified_by = "${user_id}", modified_dt = "${datetime}" WHERE id = "${id}"`;
        // console.log(sql);
        db.query(sql, (err, lastId) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Updated Successfully!!' };
            }
            resolve(data)
        })
    })
}

module.exports = { ClientGetTkt, ClientTktSave, ClientUploadFile, ClientTktUpdate };