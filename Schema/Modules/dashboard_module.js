const db = require('../db');
var data = {};

const OpenCloseTkt = (args) => {
    const { user_type, user_id } = args;
    var whr_cls = user_type == 'E' || user_type == 'W' ? `AND assign_engg = "${user_id}"` : '';
    var sql = `SELECT SUM(opened) opened, SUM(closed) closed
                FROM
                (SELECT COUNT(id) opened, 0 closed FROM td_support_log WHERE work_status = '0' AND DATE(log_in) = CURRENT_DATE() ${whr_cls}
                UNION
                SELECT 0 opened, COUNT(id) closed FROM td_support_log WHERE work_status > '0' AND DATE(log_in) = CURRENT_DATE() ${whr_cls}
                )a`
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

const CloseTkt = (args) => {
    const { user_type, user_id } = args;
    var whr_cls = user_type == 'E' || user_type == 'W' ? `AND assign_engg = "${user_id}"` : '';
    var whr = user_type == 'E' || user_type == 'W' ? `WHERE assign_engg = "${user_id}"` : '';
    var sql = `SELECT SUM(today) today, SUM(yesterday) yesterday, SUM(this_month) this_month, SUM(last_month) last_month, SUM(this_year) this_year, SUM(lifetime) lifetime
                FROM
                (SELECT COUNT(tkt_no) today, 0 yesterday, 0 this_month, 0 last_month, 0 this_year, 0 lifetime FROM td_support_log
                WHERE DATE(log_in) = CURRENT_DATE() ${whr_cls}
                UNION
                SELECT 0 today, COUNT(tkt_no) yesterday, 0 this_month, 0 last_month, 0 this_year, 0 lifetime FROM td_support_log
                WHERE DATE(log_in) = DATE(CURRENT_DATE() - 1) ${whr_cls}
                UNION
                SELECT 0 today, 0 yesterday, COUNT(tkt_no) this_month, 0 last_month, 0 this_year, 0 lifetime FROM td_support_log
                WHERE MONTH(log_in) = MONTH(CURDATE()) ${whr_cls}
                UNION
                SELECT 0 today, 0 yesterday, 0 this_month, COUNT(tkt_no) last_month, 0 this_year, 0 lifetime FROM td_support_log
                WHERE MONTH(log_in) = MONTH(CURDATE() - INTERVAL 1 MONTH) ${whr_cls}
                UNION
                SELECT 0 today, 0 yesterday, 0 this_month, 0 last_month, COUNT(tkt_no) this_year, 0 lifetime FROM td_support_log
                WHERE YEAR(log_in) = YEAR(CURRENT_DATE()) ${whr_cls}
                UNION
                SELECT 0 today, 0 yesterday, 0 this_month, 0 last_month, 0 this_year, COUNT(tkt_no) lifetime FROM td_support_log ${whr}
                ) a`;
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

const OpenTktByStatus = (args) => {
    const { user_type, user_id } = args;
    var whr_cls = user_type == 'E' || user_type == 'W' ? `AND assign_engg = "${user_id}"` : '';
    var sql = `SELECT a.tkt_status,count(b.tkt_status) as status
                from md_tkt_status a,td_support_log b
                where a.id = b.tkt_status
                and   CAST(b.log_in AS DATE) = CURRENT_DATE() ${whr_cls}
                group by a.tkt_status
                order by a.tkt_status`;
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

const WorkDone = (args) => {
    const { user_type, user_id } = args;
    var whr_cls = user_type == 'E' || user_type == 'W' ? `AND a.assign_engg = "${user_id}"` : '';
    var sql = `SELECT COUNT(a.tkt_no) as done, b.emp_name
                FROM td_support_log a
                JOIN md_employee b ON a.assign_engg=b.emp_code
                WHERE a.work_status > 0
                AND DATE(log_in) = CURRENT_DATE() ${whr_cls}
                group by a.assign_engg
                order by a.assign_engg`;
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

const TotalTktByDate = (args) => {
    const { user_type, user_id } = args;
    var whr_cls = user_type == 'E' || user_type == 'W' ? `AND assign_engg = "${user_id}"` : '';
    var sql = `SELECT no_tkt, date_name
                FROM
                (	SELECT COUNT(id) as no_tkt, date_format(CURRENT_DATE()- INTERVAL 6 DAY, "%d/%m") as date_name FROM td_support_log WHERE DATE(log_in) = DATE(CURRENT_DATE()- INTERVAL 6 DAY) ${whr_cls}
                    UNION
                    SELECT COUNT(id) as no_tkt, date_format(CURRENT_DATE()- INTERVAL 5 DAY, "%d/%m") as date_name FROM td_support_log WHERE DATE(log_in) = DATE(CURRENT_DATE()- INTERVAL 5 DAY) ${whr_cls}
                    UNION
                    SELECT COUNT(id) as no_tkt, date_format(CURRENT_DATE()- INTERVAL 4 DAY, "%d/%m") as date_name FROM td_support_log WHERE DATE(log_in) = DATE(CURRENT_DATE()- INTERVAL 4 DAY) ${whr_cls}
                    UNION
                    SELECT COUNT(id) as no_tkt, date_format(CURRENT_DATE()- INTERVAL 3 DAY, "%d/%m") as date_name FROM td_support_log WHERE DATE(log_in) = DATE(CURRENT_DATE()- INTERVAL 3 DAY) ${whr_cls}
                    UNION
                    SELECT COUNT(id) as no_tkt, date_format(CURRENT_DATE()- INTERVAL 2 DAY, "%d/%m") as date_name FROM td_support_log WHERE DATE(log_in) = DATE(CURRENT_DATE()- INTERVAL 2 DAY) ${whr_cls}
                    UNION
                    SELECT COUNT(id) as no_tkt, date_format(CURRENT_DATE() - INTERVAL 1 DAY, "%d/%m") as date_name FROM td_support_log WHERE DATE(log_in) = DATE(CURRENT_DATE() - INTERVAL 1 DAY) ${whr_cls}
                    UNION
                    SELECT COUNT(id) as no_tkt, date_format(CURRENT_DATE(), "%d/%m") as date_name FROM td_support_log WHERE DATE(log_in) = DATE(CURRENT_DATE()) ${whr_cls}
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

const TotalTktByClint = (args) => {
    const { user_type, user_id } = args;
    var whr_cls = user_type == 'E' || user_type == 'W' ? `AND a.assign_engg = "${user_id}"` : '';
    var sql = `SELECT COUNT(a.tkt_no) total_tkt, c.client_type
                FROM td_support_log a
                JOIN md_client b ON a.client_id=b.id
                JOIN md_client_type c ON b.client_type_id=c.id
                WHERE DATE(a.log_in) = DATE(CURRENT_DATE()) ${whr_cls}
                GROUP BY b.client_type_id
                ORDER BY b.client_type_id`;
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


module.exports = { OpenCloseTkt, CloseTkt, OpenTktByStatus, WorkDone, TotalTktByDate, TotalTktByClint };



// var dashboard_1_sql = `SELECT SUM(opened) opened, SUM(closed) closed
// FROM
// (SELECT COUNT(id) opened, 0 closed FROM td_support_log WHERE work_status > '0' AND DATE(log_in) = CURRENT_DATE()
// UNION
// SELECT 0 opened, COUNT(id) closed FROM td_support_log WHERE work_status = '0' AND DATE(log_in) = CURRENT_DATE()
// )a`;

//var dashboard_2_sql = `SELECT DATE_SUB('2021-07-31', INTERVAL WEEKDAY('2021-07-31')+8 DAY) last_sunday, DATE_SUB('2021-07-31', INTERVAL WEEKDAY('2021-07-31')+1 DAY) this_sunday`;

// var dashboard_3_sql = `SELECT SUM(par) par, SUM(temp) temp, SUM(delay) delay, SUM(working) working, SUM(work_pen) work_pen, SUM(dis) dis, SUM(delivered) delivered, SUM(sugg_giv) sugg_giv, SUM(net_con_prob) net_con_prob, SUM(ph_not_rec) ph_not_rec, SUM(deli_pend) deli_pend, SUM(hard_prob) hard_prob, SUM(off_clos) off_clos, SUM(ph_nt_rech) ph_nt_rech, SUM(clnt_call_twm) clnt_call_twm, SUM(wrn_num) wrn_num, SUM(clnt_solv_prob) clnt_solv_prob, SUM(ph_busy) ph_busy, SUM(ml_ned) ml_ned
// FROM
// (SELECT COUNT(tkt_status) par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 1
// UNION
// SELECT 0 par, COUNT(tkt_status) temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 2
// UNION
// SELECT 0 par, 0 temp, COUNT(tkt_status) delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 3
// UNION
// SELECT 0 par, 0 temp, 0 delay, COUNT(tkt_status) working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 4
// UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, COUNT(tkt_status) work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 5
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, COUNT(tkt_status) dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 6
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, COUNT(tkt_status) delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 7
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, COUNT(tkt_status) sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 8
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, COUNT(tkt_status) net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 9
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, COUNT(tkt_status) ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 10
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, COUNT(tkt_status) deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 11
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, COUNT(tkt_status) hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 12
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, COUNT(tkt_status) off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 13
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, COUNT(tkt_status) ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 14
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, COUNT(tkt_status) clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 15
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, COUNT(tkt_status) wrn_num, 0 clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 16
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, COUNT(tkt_status) clnt_solv_prob, 0 ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 17
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, COUNT(tkt_status) ph_busy, 0 ml_ned
// FROM td_support_log WHERE tkt_status = 18
//  UNION
// SELECT 0 par, 0 temp, 0 delay, 0 working, 0 work_pen, 0 dis, 0 delivered, 0 sugg_giv, 0 net_con_prob, 0 ph_not_rec, 0 deli_pend, 0 hard_prob, 0 off_clos, 0 ph_nt_rech, 0 clnt_call_twm, 0 wrn_num, 0 clnt_solv_prob, 0 ph_busy, COUNT(tkt_status) ml_ned
// FROM td_support_log WHERE tkt_status = 19
// ) a`;

// var dashboard_4_sql = `SELECT SUM(today) today, SUM(yesterday) yesterday, SUM(this_month) this_month, SUM(last_month) last_month, SUM(this_year) this_year, SUM(lifetime) lifetime
// FROM
// (SELECT COUNT(tkt_no) today, 0 yesterday, 0 this_month, 0 last_month, 0 this_year, 0 lifetime FROM td_support_log WHERE DATE(log_in) = CURRENT_DATE()
// UNION
// SELECT 0 today, COUNT(tkt_no) yesterday, 0 this_month, 0 last_month, 0 this_year, 0 lifetime FROM td_support_log WHERE DATE(log_in) = DATE(CURRENT_DATE() - 1)
// UNION
// SELECT 0 today, 0 yesterday, COUNT(tkt_no) this_month, 0 last_month, 0 this_year, 0 lifetime FROM td_support_log WHERE MONTH(log_in) = MONTH(CURDATE())
// UNION
// SELECT 0 today, 0 yesterday, 0 this_month, COUNT(tkt_no) last_month, 0 this_year, 0 lifetime FROM td_support_log WHERE MONTH(log_in) = MONTH(CURDATE() - INTERVAL 1 MONTH)
// UNION
// SELECT 0 today, 0 yesterday, 0 this_month, 0 last_month, COUNT(tkt_no) this_year, 0 lifetime FROM td_support_log WHERE YEAR(log_in) = YEAR(CURRENT_DATE())
// UNION
// SELECT 0 today, 0 yesterday, 0 this_month, 0 last_month, 0 this_year, COUNT(tkt_no) lifetime FROM td_support_log
// ) a`;