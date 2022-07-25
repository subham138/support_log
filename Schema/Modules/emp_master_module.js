const db = require('../db');
const dateFormat = require('dateformat');
let data = {};
var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

const GetEmpData = (args) => {
    const { id } = args;
    let check = id != '' && id > 0 ? `WHERE id = ${id}` : '';
    let sql = `SELECT * FROM md_employee ${check}`;
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

const input_emp = (args) => {
    const { emp_code, emp_name, phone_no, email, emp_designation, remarks, code_no } = args;
    let sql = `INSERT INTO md_employee (emp_code, emp_name, phone_no, email, emp_designation, remarks, created_by, created_dt) VALUES ("${emp_code}", "${emp_name}", "${phone_no}", "${email}", "${emp_designation}", "${remarks}", "${code_no}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) { data = { success: 0, message: 'Data Not Inserted' }; console.log({ msg: err }); }
            else {
                data = { success: 1, message: 'Data Inserted Successfully' };
            }
            resolve(data);
        })
    })
}

const empSave = (args) => {
    const { emp_code, emp_name, phone_no, email, emp_designation, remarks } = args;
    let sql = `SELECT * FROM md_employee WHERE emp_code = ${emp_code}`;
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, result) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            }
            if (result.length > 0) {
                data = { success: 0, message: 'User Already Exist' };
            } else {
                data = await input_emp(args);
            }
            console.log(data);
            resolve(data);
        })
    })
}

const emp_update = (args) => {
    const { emp_code, emp_name, phone_no, email, emp_designation, remarks, id, user_id } = args;
    let sql = `UPDATE md_employee SET emp_name = "${emp_name}", phone_no = "${phone_no}", email = "${email}", emp_designation = "${emp_designation}", remarks = "${remarks}", modified_by = "${user_id}", modified_dt = "${datetime}" WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, insertId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Updated Successfully !!' };
            }
            resolve(data);
        })
    })
}

const DeleteEmp = (args) => {
    const { id } = args;
    let sql = `DELETE FROM md_employee WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: "Deleted Successfully !!" };
            }
            resolve(data);
        })
    })
}

const GetEngList = (args) => {
	let sql = `SELECT a.*, b.user_type FROM md_employee a JOIN md_users b ON a.emp_code=b.code_no WHERE user_type IN('M','T','E', 'W') AND user_status='A' ORDER BY a.emp_name`;
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

module.exports = { empSave, GetEmpData, emp_update, DeleteEmp, GetEngList };