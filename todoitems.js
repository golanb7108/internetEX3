/**
 * Created by aabel on 15-Jan-15.
 */

var settings = require('./settings');

var todo_items = [];

function new_user_todo_list(user_name){
    if (user_name === undefined){
        throw settings.invalid_value_error;
    }
    todo_items[user_name] = [];
}

exports.new_user_todo_list = new_user_todo_list;