const dateFormat = require('dateformat');
const db = require('../db');
let data = {};
let datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

const GetMasterData = (args) => {
    const { db_type } = args;
    var db_name = '';
    switch (db_type) {
        case 1:
            db_name = 'md_client_type';
            id_name = 'client_id';
            field = 'client_type';
            return GetData(args, db_name, field, id_name);
        // break;
        case 2:
            db_name = 'md_oprn_mode';
            id_name = 'oprn_id';
            field = 'oprn_mode';
            return GetData(args, db_name, field, id_name);
        // break;
        case 3:
            db_name = 'md_tkt_status';
            id_name = 'tkt_id';
            field = 'tkt_status';
            return GetData(args, db_name, field, id_name);
        // break;
        case 4:
            db_name = 'md_priority_mode';
            id_name = 'priority_id';
            field = 'priority_mode';
            return GetData(args, db_name, field, id_name);
        // break;
        case 5:
            db_name = 'md_module';
            id_name = 'module_id';
            field = 'module_type';
            return GetData(args, db_name, field, id_name);
        // break;
        default:
            console.log("ERROR BY DEFAULT CASE");
            break;
    }
}

const MasterInsertData = (args) => {
    const { db_type } = args;
    var db_name = '';
    var field = '';
    switch (db_type) {
        case 1:
            db_name = 'md_client_type';
            field = 'client_type';
            return InsertData(args, db_name, field);
        // break;
        case 2:
            db_name = 'md_oprn_mode';
            field = 'oprn_mode';
            return InsertData(args, db_name, field);
        // break;
        case 3:
            db_name = 'md_tkt_status';
            field = 'tkt_status';
            return InsertData(args, db_name, field);
        // break;
        case 4:
            db_name = 'md_priority_mode';
            field = 'priority_mode';
            return InsertData(args, db_name, field);
        // break;
        case 5:
            db_name = 'md_module';
            field = 'module_type';
            return InsertData(args, db_name, field);
        // break;
        default:
            console.log("ERROR BY DEFAULT CASE");
            break;
    }
}

const MasterUpdateData = (args) => {
    const { db_type } = args;
    var db_name = '';
    var field = '';
    switch (db_type) {
        case 1:
            db_name = 'md_client_type';
            field = 'client_type';
            return UpdateData(args, db_name, field);
        // break;
        case 2:
            db_name = 'md_oprn_mode';
            field = 'oprn_mode';
            return UpdateData(args, db_name, field);
        // break;
        case 3:
            db_name = 'md_tkt_status';
            field = 'tkt_status';
            return UpdateData(args, db_name, field);
        // break;
        case 4:
            db_name = 'md_priority_mode';
            field = 'priority_mode';
            return UpdateData(args, db_name, field);
        // break;
        case 5:
            db_name = 'md_module';
            field = 'module_type';
            return UpdateData(args, db_name, field);
        // break;
        default:
            console.log("ERROR BY DEFAULT CASE");
            break;
    }
}

const MasterDeleteData = (args) => {
    const { db_type } = args;
    var db_name = '';
    var field = '';
    switch (db_type) {
        case 1:
            db_name = 'md_client_type';
            return DeleteData(args, db_name);
        // break;
        case 2:
            db_name = 'md_oprn_mode';
            return DeleteData(args, db_name);
        // break;
        case 3:
            db_name = 'md_tkt_status';
            return DeleteData(args, db_name);
        // break;
        case 4:
            db_name = 'md_priority_mode';
            return DeleteData(args, db_name);
        // break;
        case 5:
            db_name = 'md_module';
            return DeleteData(args, db_name);
        // break;
        default:
            console.log("ERROR BY DEFAULT CASE");
            break;
    }
}

const GetData = (args, db_name, field, id_name) => {
    const { id } = args;
    var check = id != '' && id > 0 ? `WHERE id = ${id}` : '';
    let sql = `SELECT id as ${id_name}, ${field} FROM ${db_name} ${check}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            }
            // console.log(result);
            if (result.length > 0) {
                // data = { success: 1, message: JSON.stringify(result) };
                data = result;
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}
const InsertData = (args, db_name, field) => {
    const { name, user_id } = args;
    let sql = `INSERT INTO ${db_name} (${field}, created_by, created_dt) VALUES ("${name}", "${user_id}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, insertId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Inserted Successfully !!' };
            }
            resolve(data);
        })
    })
}

const UpdateData = (args, db_name, field) => {
    const { id, name, user_id } = args;
    let sql = `UPDATE ${db_name} SET ${field} = "${name}", modified_by = "${user_id}", modified_dt = "${datetime}" WHERE id = ${id}`;
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

const DeleteData = (args, db_name) => {
    const { id } = args;
    let sql = `DELETE FROM ${db_name} WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, insertId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Delete Successfully !!' };
            }
            resolve(data);
        })
    })
}

module.exports = { GetMasterData, MasterInsertData, MasterUpdateData, MasterDeleteData };