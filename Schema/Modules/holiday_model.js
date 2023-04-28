const dateFormat = require('dateformat');
const db = require('../db');

const GetHoldayList = (id) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, evnt_date, event FROM md_holiday ${id > 0 ? 'WHERE id = ' + id : ''}`;
        db.query(sql, (err, rows) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = rows;
            }
            resolve(data);
        })
    })
}
 
const SaveHoliday = (args) => {
    const { id, evnt_date, event, code_no } = args;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"), sql;
    // console.log(args);
    if (id > 0) {
        sql = `UPDATE md_holiday SET evnt_date = "${evnt_date}", event = "${event}", modified_by = "${code_no}", modified_dt = "${datetime}" WHERE id = ${id}`;
    } else {
        sql = `INSERT INTO md_holiday (evnt_date, event, created_by, created_dt) VALUES ("${evnt_date}", "${event}", "${code_no}", "${datetime}")`;
    }
    return new Promise(async (resolve, reject) => {
        db.query(sql, (err, lastId) => {
            var data = {};
            if (err) { data = { success: 0, message: 'Data Not Inserted' }; console.log({ msg: err }); }
            else {
                data = { success: 1, message: 'Data Inserted Successfully' };
            }
            resolve(data);
        })
    })
}

module.exports = { GetHoldayList, SaveHoliday };