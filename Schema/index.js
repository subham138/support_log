const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { user_login, check_user, get_user_details, get_user_details_by_id, check_email, get_profile_dtls } = require('./Queries/User');
const { create_user, delete_user, update_user, update_user_status, update_user_type, update_approve_status, forgot_password, reset_password, update_profile, update_login_status, upload_file, remove_image } = require('./Mutations/User');
const { create_emp, update_emp, delete_emp } = require("./Mutations/Emp_master_mutation");
const { create_master_data, update_master_data, delete_master_data } = require("./Mutations/Master_mutation");
const { get_master_data, get_client_type_data, get_tkt_status_data, get_oprn_mode_data, get_priotity_mode_data, get_module_type_data } = require("./Queries/Master_query");
const { get_emp, get_eng_list } = require("./Queries/Emp_master_query");
const { get_client, get_district } = require("./Queries/Client_query");
const { create_client, update_client, delete_client } = require("./Mutations/Client_mutation");
const { create_tkt, update_assign_tkt, update_deliver_tkt, update_raise_tkt, delete_tkt, update_tkt_status, update_assign_eng } = require("./Mutations/Support_log_mutation");
const { get_supp_log, search_by_date, search_by_tkt_no, check_tkt_no, get_supp_log_done, search_by_date_client, search_by_date_employee } = require("./Queries/Support_log_query");
const { client_get_tkt } = require("./Queries/Client_support_query");
const { client_tkt_save, client_tkt_up_file, client_tkt_update } = require("./Mutations/Client_support_mutation");
const { open_close_tkt, close_tkt, open_tkt_by_status, work_done, total_tkt_by_date, total_tkt_by_client } = require("./Queries/Dashboard_query");
const { client_get_tkt_dashboard, client_monthly_support, client_open_close_tkt, client_last_tkt } = require("./Queries/Client_dashboard_query");

// console.log(USER.get_all_users);

const UserLogin = new GraphQLObjectType({
    name: 'UserLogin',
    fields: {
        userLogin: user_login,
        checkUser: check_user,
        getMasterData: get_master_data,
        getClientTypeData: get_client_type_data,
        getOprnModeData: get_oprn_mode_data,
        getTktStatusData: get_tkt_status_data,
        getPriorityModeData: get_priotity_mode_data,
        getModuleTypeData: get_module_type_data,
        getEmp: get_emp,
        getEngList: get_eng_list,
        getClient: get_client,
        getDistrict: get_district,
        getSupportLogDtls: get_supp_log,
        getUserDetailsA: get_user_details,
        getUserDetailsD: get_user_details,
        getUserDetailsById: get_user_details_by_id,
        checkEmail: check_email,
        searchByDate: search_by_date,
        searchByTktNo: search_by_tkt_no,
        searchByDateClient: search_by_date_client,
        searchByDateEmp: search_by_date_employee,
        clientGetTkt: client_get_tkt,
        checkTktNo: check_tkt_no,
        getProfileDtls: get_profile_dtls,
        openCloseTkt: open_close_tkt,
        closeTkt: close_tkt,
        openTktByStatus: open_tkt_by_status,
        workDone: work_done,
        totalTktByDate: total_tkt_by_date,
        getSuppLogDone: get_supp_log_done,
        totalTktByClient: total_tkt_by_client,
        clientGetTktDashboard: client_get_tkt_dashboard,
        clientMonthlySupport: client_monthly_support,
        clientOpenCloseTkt: client_open_close_tkt,
        clientLastTke: client_last_tkt
    }
})

const UserMutation = new GraphQLObjectType({
    name: 'UserMutation',
    fields: {
        createUser: create_user,
        updateUser: update_user,
        deleteUser: delete_user,
        insertMaster: create_master_data,
        updateMaster: update_master_data,
        insertEmpMaster: create_emp,
        updateEmp: update_emp,
        insertClient: create_client,
        updateClient: update_client,
        deleteMaster: delete_master_data,
        deleteClient: delete_client,
        deleteEmp: delete_emp,
        createTkt: create_tkt,
        updateRaiseTkt: update_raise_tkt,
        updateAssignTkt: update_assign_tkt,
        updateDeliverTkt: update_deliver_tkt,
        deleteTkt: delete_tkt,
        updateUserStatus: update_user_status,
        updateUserType: update_user_type,
        approveUser: update_approve_status,
        forgotPassword: forgot_password,
        clientTktSave: client_tkt_save,
        clientTktUpload: client_tkt_up_file,
        clientTktUpdate: client_tkt_update,
        resetPassword: reset_password,
        updateProfile: update_profile,
        updateLoginStatus: update_login_status,
        updateTktStatus: update_tkt_status,
        updateAssignEng: update_assign_eng,
        uploadImage: upload_file,
        removeImage: remove_image
    }
})

const schema = new GraphQLSchema({
    query: UserLogin,
    mutation: UserMutation
})

module.exports = { schema };