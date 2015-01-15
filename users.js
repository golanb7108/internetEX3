/**
 * Created by aabel on 15-Jan-15.
 */

var settings = require('./settings');

exports.username_already_exist_error = new Error("The user name is already in use. please enter a different user name");
exports.bad_login_params_error = new Error("Your login params are not valid. Please insert new parameters");
exports.passwords_dont_match_error = new Error("The passwords  and the verify password do not match");
exports.password_incorrect_error = new Error("The passwords is incorrect please enter it again");
exports.user_expire_time_error = new Error("The expire time was over");

var users_list = [];

var User = function (full_name, password, session_id){
    this.full_name = full_name;
    this.password = password;
    this.session_id = session_id;
    this.time_to_expire = new Date(Date.now() + settings.DEFALUT_TIME_TO_EXPIRE);
};

function add_user(user_name, full_name, password, verify_password, session_id){
    if ((user_name === undefined) ||(full_name === undefined) || (password === undefined)
            || (verify_password === undefined) || (session_id === undefined)){
        throw this.bad_login_params_error;
    } else if (users_list[user_name] !== undefined){
        throw this.username_already_exist_error;
    } else if ((user_name.length < 1) ||(full_name.length < 1) || (password.length < 1)
            || (verify_password.length < 1)){
        throw this.bad_login_params_error;
    } else if (password !== verify_password){
        throw this.passwords_dont_match_error;
    }else {
        users_list[user_name] = new User(full_name, password, session_id);
    }
}

function get_user_by_name(user_name){
    console.log(user_name);
    console.log(users_list);
    if (users_list[user_name] === undefined){
        throw this.bad_login_params_error;
    }
    return users_list[user_name];
}

function get_user_by_session_id(session_id){
    var user;
    for (user in users_list){
        if (users_list[user].session_id === session_id){
            if (users_list[user].time_to_expire < Date.now()){
                throw this.user_expire_time_error;
            }
            users_list[user] = new Date(Date.now() + settings.DEFALUT_TIME_TO_EXPIRE);
            return users_list[user];
        }
    }
    throw settings.invalid_value_error;
}

function try_to_login(user_name, password, session_id){
    if ((user_name === undefined) || (password === undefined) ||
            (session_id === undefined) || (users_list[user_name] === undefined)){
        throw this.bad_login_params_error;
    }
    if (users_list[user_name].password !== password){
        throw this.password_incorrect_error;
    }
    users_list[user_name].session_id = session_id;
    users_list[user_name].time_to_expire = new Date(Date.now() + settings.DEFALUT_TIME_TO_EXPIRE);
    return 1;
}

exports.add_user = add_user;
exports.get_user_by_name = get_user_by_name;
exports.get_user_by_session_id = get_user_by_session_id;
exports.try_to_login = try_to_login;