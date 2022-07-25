const db = require('../db');
const dateFormat = require('dateformat');
var data = {};
var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

const GetClient = (args) => {
    const { id, active } = args;
    var check = id != '' && id > 0 ? `WHERE a.id = "${id}"` : '';
    var whr = id != '' && id > 0 ? 'AND' : 'WHERE';
    var active_chk = active > 0 ? `${whr} a.support_status = "A"` : (active != '' || active == '0' ? `${whr} a.support_status = "D"` : '');
    var sql = `SELECT a.*, b.client_type, c.district_name, d.oprn_mode 
	FROM md_client a 
	JOIN md_client_type b ON a.client_type_id=b.id 
	JOIN md_district c ON a.district_id=c.id 
	JOIN md_oprn_mode d ON a.oprn_mode_id=d.id ${check} ${active_chk} ORDER BY a.id`;
    // console.log(sql);
    // console.log({ active, check, whr, sql });
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, result) => {
            if (err) {
                console.log({ msg: err });
                // data = { success: 0, message: JSON.stringify(err) };
                throw err;
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}

const save_client = (args) => {
    const { client_name, district_id, client_type_id, oprn_mode_id, client_addr, tech_person, tech_designation, phone_no, email, working_hrs, support_mode, amc_upto, rental_upto, support_status, schema_name, remarks, user_id } = args;
    let rental_upto_val = rental_upto != '' ? `"${rental_upto}"` : null;
    let amc_upto_val = amc_upto != '' ? `"${amc_upto}"` : null;
    let sql = `INSERT INTO md_client (client_name, district_id, client_type_id, oprn_mode_id, client_addr, tech_person, tech_designation, phone_no, email, working_hrs, support_mode, amc_upto, rental_upto, support_status, schema_name, remarks, created_by, created_dt) 
    VALUES ("${client_name}", "${district_id}", "${client_type_id}", "${oprn_mode_id}", "${client_addr}", "${tech_person}", "${tech_designation}", "${phone_no}", "${email}", "${working_hrs}", "${support_mode}", ${amc_upto_val}, ${rental_upto_val}, "${support_status}", "${schema_name}", "${remarks}", "${user_id}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, InsertId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Inserted Successfully !!!' };
            }
            resolve(data);
        })
    })
}

const CheckClient = (args) => {
    const { client_name } = args;
    var sql = `SELECT * FROM md_client WHERE client_name = "${client_name}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, result) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            }
            if (result.length > 0) {
                data = { success: 2, message: 'Client Already Exist' };
            } else {
                var data = await save_client(args);
            }
            resolve(data);
        })
    })
}

const UpdateClient = (args) => {
    const { id, client_name, district_id, client_type_id, oprn_mode_id, client_addr, tech_person, tech_designation, phone_no, email, working_hrs, support_mode, amc_upto, rental_upto, support_status, schema_name, remarks, user_id } = args;
    let rental_upto_val = rental_upto != '' ? `rental_upto = "${rental_upto}",` : '';
    let amc_upto_val = amc_upto != '' ? `amc_upto = "${amc_upto}", ` : '';
    let sql = `UPDATE md_client SET client_name = "${client_name}", district_id = "${district_id}", client_type_id = "${client_type_id}", oprn_mode_id = "${oprn_mode_id}", client_addr = "${client_addr}", tech_person = "${tech_person}", tech_designation = "${tech_designation}", phone_no = "${phone_no}", email = "${email}", working_hrs = "${working_hrs}", support_mode = "${support_mode}", ${amc_upto_val} ${rental_upto_val} support_status = "${support_status}", schema_name = "${schema_name}", remarks = "${remarks}", created_by = "${user_id}", created_dt = "${datetime}" WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, InsertId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Updated Successfully !!!' };
            }
            resolve(data);
        })
    })
}

const DeleteClient = (args) => {
    const { id } = args;
    var sql = `DELETE FROM md_client WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Deleted Successfully !!' };
            }
            resolve(data);
        })
    })
}

const GetDistrict = () => {
    let sql = `SELECT id, district_name as name FROM md_district`;
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

module.exports = { GetClient, CheckClient, UpdateClient, GetDistrict, DeleteClient };