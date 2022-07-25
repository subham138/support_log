const db = require('../db');

const ClientGetTktDashboard = (args) => {
    var { client_id } = args;
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
                WHERE a.client_id = "${client_id}" ORDER BY log_in DESC
                LIMIT 10`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = { success: 0, message: JSON.parse(err) };
            } else {
                data = result;
            }
            resolve(data);
        })
    })
}

const ClientOpenCloseTkt = (args) => {
    var { user_id } = args;
    var sql = `SELECT SUM(opened) opened, SUM(closed) closed
                FROM
                (SELECT COUNT(id) opened, 0 closed FROM td_support_log WHERE work_status = '0' AND client_id = "${user_id}"
                UNION
                SELECT 0 opened, COUNT(id) closed FROM td_support_log WHERE work_status > '0' AND client_id = "${user_id}"
                )a`;
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

const ClientMonthlySupport = (args) => {
    var { user_id } = args;
    var sql = `SELECT no_tkt, date_name
                FROM
                (	SELECT COUNT(id) as no_tkt, MONTHNAME(DATE(CURRENT_DATE()- INTERVAL 6 MONTH)) as date_name FROM td_support_log WHERE MONTH(log_in) = MONTH(DATE(CURRENT_DATE()- INTERVAL 6 MONTH)) AND client_id = "${user_id}"
                    UNION
                    SELECT COUNT(id) as no_tkt, MONTHNAME(DATE(CURRENT_DATE()- INTERVAL 5 MONTH)) as date_name FROM td_support_log WHERE MONTH(log_in) = MONTH(DATE(CURRENT_DATE()- INTERVAL 5 MONTH)) AND client_id = "${user_id}"
                    UNION
                    SELECT COUNT(id) as no_tkt, MONTHNAME(DATE(CURRENT_DATE()- INTERVAL 4 MONTH)) as date_name FROM td_support_log WHERE MONTH(log_in) = MONTH(DATE(CURRENT_DATE()- INTERVAL 4 MONTH)) AND client_id = "${user_id}"
                    UNION
                    SELECT COUNT(id) as no_tkt, MONTHNAME(DATE(CURRENT_DATE()- INTERVAL 3 MONTH)) as date_name FROM td_support_log WHERE MONTH(log_in) = MONTH(DATE(CURRENT_DATE()- INTERVAL 3 MONTH)) AND client_id = "${user_id}"
                    UNION
                    SELECT COUNT(id) as no_tkt, MONTHNAME(DATE(CURRENT_DATE()- INTERVAL 2 MONTH)) as date_name FROM td_support_log WHERE MONTH(log_in) = MONTH(DATE(CURRENT_DATE()- INTERVAL 2 MONTH)) AND client_id = "${user_id}"
                    UNION
                    SELECT COUNT(id) as no_tkt, MONTHNAME(DATE(CURRENT_DATE()- INTERVAL 1 MONTH)) as date_name FROM td_support_log WHERE MONTH(log_in) = MONTH(DATE(CURRENT_DATE()- INTERVAL 1 MONTH)) AND client_id = "${user_id}"
                    UNION
                    SELECT COUNT(id) as no_tkt, MONTHNAME(DATE(CURRENT_DATE())) as date_name FROM td_support_log WHERE MONTH(log_in) = MONTH(CURRENT_DATE()) AND client_id = "${user_id}"
                )a`;
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

const ClientLastTkt = (args) => {
    var { user_id } = args;
    var sql = `SELECT a.*, b.client_name, c.district_name, d.client_type, e.oprn_mode, b.client_addr,
                b.rental_upto, b.working_hrs, b.rental_upto, f.module_type, g.tkt_status as tktStatus, h.emp_name, h.email, h.phone_no
                FROM td_support_log a
                JOIN md_client b ON a.client_id=b.id
                JOIN md_district c ON b.district_id=c.id
                JOIN md_client_type d ON b.client_type_id=d.id
                JOIN md_oprn_mode e ON b.oprn_mode_id=e.id
                JOIN md_module f ON a.tkt_module=f.id
                LEFT JOIN md_tkt_status g ON a.tkt_status=g.id
                LEFT JOIN md_employee h ON a.assign_engg=h.emp_code
                WHERE a.client_id = "${user_id}" AND a.work_status = "0" ORDER BY a.id DESC
                LIMIT 1`;
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

module.exports = { ClientGetTktDashboard, ClientMonthlySupport, ClientOpenCloseTkt, ClientLastTkt };