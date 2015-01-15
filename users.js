/**
 * Created by aabel on 15-Jan-15.
 */

var settings = require('./settings');

exports.username_already_exist_error = new Error("The user name is already in use. please enter a different user name");
exports.bad_login_params_error = new Error("Your login params are not valid. Please insert new parameters");
exports.passwords_dont_match_error = new Error("The passwords  and the verify password do not match");
exports.password_incorrect_error = new Error("The passwords is incorrect please enter it again");

var users_list = [];

var User = function (full_name, password, session_id){
    this.full_name = full_name;
    this.password = password;
    this.session_id = session_id;
    this.time_to_expire = new Date(Date.now() + settings.DEFALUT_TIME_TO_EXPIRE);
};

function add_user(user_name, full_name, password, verify_password, session_id){
    if ((user_name === undefined) ||(full_name === undefined) || (password === undefined)
            || (password === undefined) || (session_id === undefined)){
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

function get_user(user_name){
    if (users_list[user_name] === undefined){
        throw this.bad_login_params_error;
    }
    return users_list[user_name];
}

function try_to_register(user_name, password, session_id){
    if ((user_name === undefined) || (password === undefined) || (session_id === undefined)){
        throw this.bad_login_params_error;
    }
    if (users_list[user_name].password !== password){
        throw this.password_incorrect_error;
    }
    users_list[user_name].session_id = session_id;
    users_list[user_name].time_to_expire = new Date(Date.now() + settings.DEFALUT_TIME_TO_EXPIRE);
    return 0;
}

exports.add_user = add_user;
exports.get_user = get_user;
exports.try_to_register = try_to_register;