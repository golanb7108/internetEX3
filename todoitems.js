/**
 * Created by aabel on 15-Jan-15.
 */

var settings = require('./settings');

exports.bad_item_params_error = new Error("The item params are wrong. Please insert new parameters");

var todo_items = [];

var Item = function (task){
    this.task = task;
    this.completed = '0';
};

function new_user_todo_list(user_name){
    if (user_name === undefined){
        throw settings.invalid_value_error;
    }
    todo_items[user_name] = {};
}

function get_item_by_user(user_name){
    if ((user_name === undefined) || (todo_items[user_name] === undefined)){
        throw settings.invalid_value_error;
    }
    return todo_items[user_name];
}

function add_item_to_user(user_name, item_task){
    if ((user_name === undefined) || (item_task === undefined) || (todo_items[user_name] === undefined)){
        throw settings.invalid_value_error;
    }
    todo_items[user_name][Object.keys(todo_items[user_name]).length] = new Item(item_task);
}

function update_item_for_user(user_name, item_id, item_task, item_status){
    if ((user_name === undefined) || (todo_items[user_name] === undefined)){
        throw settings.invalid_value_error;
    } else if (todo_items[user_name][item_id] === undefined){
        throw this.bad_item_params_error;
    }
    if (item_task !== undefined){
        todo_items[user_name][item_id].task = item_task;
    }
    if (item_status !== undefined){
        todo_items[user_name][item_id].completed = item_status;
    }
}

function delete_item_for_user(user_name, item_id){
    var index_id,
        item_length;
    if ((user_name === undefined) || (todo_items[user_name] === undefined)){
        throw settings.invalid_value_error;
    }  else if (todo_items[user_name][item_id] === undefined){
        throw this.bad_item_params_error;
    } else {
        item_length = Object.keys(todo_items[user_name]).length;
        for (index_id = item_id; index_id < item_length-1; index_id++){
            todo_items[user_name][index_id] = todo_items[user_name][index_id+1];
        }
        delete todo_items[user_name][item_length-1];
    }
}

function delete_all_items_for_user(user_name){
    if ((user_name === undefined) || (todo_items[user_name] === undefined)){
        throw settings.invalid_value_error;
    }
    todo_items[user_name] = {};
}

exports.new_user_todo_list = new_user_todo_list;
exports.get_item_by_user = get_item_by_user;
exports.add_item_to_user = add_item_to_user;
exports.update_item_for_user = update_item_for_user;
exports.delete_item_for_user = delete_item_for_user;
exports.delete_all_items_for_user = delete_all_items_for_user;