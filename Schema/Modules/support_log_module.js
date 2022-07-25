const db = require('../db');
const dateFormat = require('dateformat');
var data = {};
var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

const GetTktNo = () => {
    var sql = `SELECT ifnull(MAX(id)+1,1) id FROM td_support_log`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log({ success: 0, message: JSON.stringify(err) });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}

const SupLogGet = (args) => {
    const { id, tag, user_type, user_id } = args;
    var where = id != '' && id > 0 ? `WHERE a.id = ${id}` : '';
    var suf = id != '' && id > 0 ? 'AND' : 'WHERE';
    //var assin = tag == '1' && tag != '' ? `${suf} assign_engg IS NULL` : (tag == '0' && tag != '' ? `${suf} assign_engg IS NOT NULL AND work_status='0'` : (tag == '2' && tag != '' ? `${suf} work_status='0'` : `${suf} work_status='0'`));
    var assin = tag == '1' && tag != '' ? `${suf} a.work_status='0'` : (tag == '0' && tag != '' ? `${suf} assign_engg IS NOT NULL AND work_status='0'` : (tag == '2' && tag != '' ? `${suf} a.work_status='0'` : ''));
    var pre_user = id > 0 || tag >= 0 ? 'AND' : 'WHERE';
    var user = user_type == 'E' || user_type == 'W' ? `${pre_user} a.assign_engg="${user_id}"` : '';
    var sql = `SELECT a.*, b.client_name, b.client_type_id, b.schema_name, c.district_name, d.client_type, e.oprn_mode, b.working_hrs, b.amc_upto, b.rental_upto, 
    f.priority_mode priority, g.module_type module, h.emp_name, i.tkt_status as tktStatus
    FROM td_support_log a
    JOIN md_client b ON a.client_id=b.id
    JOIN md_district c ON b.district_id=c.id
    JOIN md_client_type d ON b.client_type_id=d.id
    JOIN md_oprn_mode e ON b.oprn_mode_id=e.id
    JOIN md_priority_mode f ON a.priority_status=f.id
    JOIN md_module g ON a.tkt_module=g.id
    LEFT JOIN md_employee h ON a.assign_engg=h.emp_code
	LEFT JOIN md_tkt_status i ON a.tkt_status=i.id ${where} ${assin} ${user} ORDER BY a.id`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            // console.log(result);
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
                //data = { success: 0, message: sql };
            }
            resolve(data);
        })
    })
}

const SupLogEntry = async (args) => {
    const { client_id, tkt_module, phone_no, priority_status, prob_reported, remarks, user_id } = args;
    const tkt_no = await GetTktNo();
    const tmstamp = dateFormat(new Date(), "ddmmyy");
    var tkt = `T/${tmstamp}/${client_id}/${tkt_no[0].id}`;
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    console.log(tmstamp);
    var sql = `INSERT INTO td_support_log
    (tkt_no, client_id, tkt_module, log_in, phone_no, priority_status, prob_reported, remarks, created_by, created_dt)
     VALUES ("${tkt}", "${client_id}", "${tkt_module}", "${datetime}", "${phone_no}", "${priority_status}",
     '${prob_reported}', '${remarks}', "${user_id}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Insert Successfully !!' };
            }
            resolve(data);
        })
    })
}

const UpdateRaiseTkt = (args) => {
    const { id, tkt_module, phone_no, priority_status, prob_reported, remarks, user_id } = args;
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE td_support_log SET tkt_module="${tkt_module}", phone_no="${phone_no}", priority_status="${priority_status}", prob_reported='${prob_reported}', remarks='${remarks}', modified_by="${user_id}", modified_dt="${datetime}" WHERE id="${id}"`;
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

const UpdateTktStatus = (args) => {
    const { id, user_id, tkt_status } = args;
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE td_support_log SET tkt_status="${tkt_status}", call_attend="${datetime}", modified_by="${user_id}", modified_dt="${datetime}" WHERE id="${id}" `;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: "Updated Successfully!!" };
            }
            resolve(data);
        })
    })
}

const UpdateAssignEng = (args) => {
    const { id, assign_engg, user_id } = args;
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE td_support_log SET assign_engg="${assign_engg}", modified_by="${user_id}", modified_dt="${datetime}" WHERE id="${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: "Updated Successfully!!" };
            }
            resolve(data);
        })
    })
}

const UpdateAssignTkt = (args) => {
    const { id, assign_engg, prob_reported, remarks, user_id } = args;
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE td_support_log SET assign_engg="${assign_engg}", remarks='${remarks}', modified_by="${user_id}", modified_dt="${datetime}" WHERE id="${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: "Updated Successfully!!" };
            }
            resolve(data);
        })
    })
}

const UpdateDeliverTkt = (args) => {
    const { id, call_attend, delivery, tkt_status, prob_reported, remarks, work_status, user_id } = args;
    var col = delivery != '' ? `delivery="${delivery}",` : '';
    datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    return new Promise((resolve, reject) => {
        if (tkt_status == 4 && work_status == 1) {
            data = { success: 2, message: 'Please Change Ticket Status' };
            resolve(data);
        } else {
            var sql = `UPDATE td_support_log SET call_attend="${call_attend}", ${col} tkt_status="${tkt_status}", prob_reported='${prob_reported}', remarks='${remarks}', work_status="${work_status}", modified_by="${user_id}", modified_dt="${datetime}" WHERE id="${id}"`;
            db.query(sql, (err, lastId) => {
                if (err) {
                    console.log({ msg: err });
                    data = { success: 0, message: JSON.stringify(err) };
                } else {
                    data = { success: 1, message: "Updated Successfully!!" };
                }
                resolve(data);
            })
        }
    })
}

const DeleteTkt = (args) => {
    const { id } = args;
    var sql = `DELETE FROM td_support_log WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = { success: 1, message: 'Deleted Successfully!!' };
            }
            resolve(data)
        })
    })
}

const SearchByDate = (args) => {
    const { frm_dt, to_dt, user_id, user_type } = args;
    var user = user_type != 'C' ? 'a.assign_engg' : 'a.client_id';
    var wht_con = user_id != '' && user_id > 0 ? (user_type != 'T' ? `AND ${user} = ${user_id}` : '') : '';
    var sql = `SELECT a.*, b.client_name, h.emp_name, i.tkt_status as tktStatus
    FROM td_support_log a
    JOIN md_client b ON a.client_id=b.id
    LEFT JOIN md_employee h ON a.assign_engg=h.emp_code
    LEFT JOIN md_tkt_status i ON a.tkt_status=i.id
    WHERE date(a.log_in) >= "${frm_dt}" AND date(a.log_in) <= "${to_dt}" ${wht_con}`;
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

const SearchByTktNo = (args) => {
    const { tkt_no, user_id, user_type } = args;
    var user = user_type != 'C' ? 'a.assign_engg' : 'a.client_id';
    var wht_con = user_id != '' && user_id > 0 ? `AND ${user} = ${user_id}` : '';
    var sql = `SELECT a.*, b.client_name, h.emp_name, i.tkt_status as tktStatus
    FROM td_support_log a
    JOIN md_client b ON a.client_id=b.id
    LEFT JOIN md_employee h ON a.assign_engg=h.emp_code
    LEFT JOIN md_tkt_status i ON a.tkt_status=i.id
    WHERE a.tkt_no = "${tkt_no}" ${wht_con}`;
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

const SearchByDateClient = (args) => {
    const { frm_dt, to_dt, user_id, user_type, client_id } = args;
    var user = user_type != 'C' ? 'a.assign_engg' : 'a.client_id';
    var wht_con = user_id != '' && user_id > 0 ? (user_type != 'T' ? `AND ${user} = ${user_id}` : '') : '';
    var sql = `SELECT a.*, b.client_name, h.emp_name, i.tkt_status as tktStatus
    FROM td_support_log a
    JOIN md_client b ON a.client_id = b.id
    LEFT JOIN md_employee h ON a.assign_engg = h.emp_code
    LEFT JOIN md_tkt_status i ON a.tkt_status = i.id
    WHERE date(a.log_in) >= "${frm_dt}" AND date(a.log_in) <= "${to_dt}" AND a.client_id=${client_id} ${wht_con} ORDER BY date(a.log_in) DESC`;
    // console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                // console.log(data);
                data = result;
            }
            resolve(data);
        })
    })
}

const SearchByDateEmp = (args) => {
    const { frm_dt, to_dt, user_id, user_type, emp_id } = args;
    var user = user_type != 'C' ? 'a.assign_engg' : 'a.client_id';
    var wht_con = user_id != '' && user_id > 0 ? (user_type != 'T' ? `AND ${user} = ${user_id}` : '') : '';
    var sql = `SELECT a.*, b.client_name, h.emp_name, i.tkt_status as tktStatus
    FROM td_support_log a
    JOIN md_client b ON a.client_id = b.id
    LEFT JOIN md_employee h ON a.assign_engg = h.emp_code
    LEFT JOIN md_tkt_status i ON a.tkt_status = i.id
    WHERE date(a.log_in) >= "${frm_dt}" AND date(a.log_in) <= "${to_dt}" AND a.assign_engg=${emp_id} ${wht_con} ORDER BY date(a.log_in) DESC`;
    // console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                // console.log(data);
                data = result;
            }
            resolve(data);
        })
    })
}

const CheckTktNo = (args) => {
    const { tkt_no } = args;
    var sql = `SELECT * FROM td_support_log WHERE tkt_no = "${tkt_no}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                console.log(result.length);
                if (result.length > 0) {
                    data = { success: 1, message: 'Tkt No Exists' };
                } else {
                    data = { success: 0, message: 'Tkt No Not Exists' };
                }

            }
            resolve(data);
        })
    })
}

const GetSupportLogDone = (args) => {
    const { user_type, user_id } = args;
    let user = user_type != 'C' ? 'assign_engg' : 'client_id'
    var wht_con = user_type != 'A' ? (user_type != 'M' ? `AND a.${user} = ${user_id}` : '') : '';
    var sql = `SELECT a.*, b.client_name, c.district_name, d.client_type, e.oprn_mode, b.working_hrs, b.amc_upto, b.rental_upto, 
    f.priority_mode priority, g.module_type module, h.emp_name, i.tkt_status as tktStatus
    FROM td_support_log a
    JOIN md_client b ON a.client_id=b.id
    JOIN md_district c ON b.district_id=c.id
    JOIN md_client_type d ON b.client_type_id=d.id
    JOIN md_oprn_mode e ON b.oprn_mode_id=e.id
    JOIN md_priority_mode f ON a.priority_status=f.id
    JOIN md_module g ON a.tkt_module=g.id
    JOIN md_employee h ON a.assign_engg=h.emp_code
	JOIN md_tkt_status i ON a.tkt_status=i.id WHERE a.work_status != '0' AND DATE(a.log_in) = DATE(CURRENT_DATE()) ${wht_con} ORDER BY a.id`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            // console.log(result);
            if (err) {
                console.log({ msg: err });
                data = { success: 0, message: JSON.stringify(err) };
            } else {
                data = result;
                //data = { success: 0, message: sql };
            }
            resolve(data);
        })
    })
}

module.exports = { GetTktNo, SupLogEntry, SupLogGet, UpdateRaiseTkt, UpdateAssignTkt, UpdateDeliverTkt, DeleteTkt, SearchByDate, SearchByTktNo, CheckTktNo, GetSupportLogDone, UpdateTktStatus, UpdateAssignEng, SearchByDateClient, SearchByDateEmp };