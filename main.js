/**
 * Created by Amit Abel and Golan Ben Ami
 */

var uuid = require('node-uuid');

exports.username_already_exist_error = new Error("The user name is already in use. please enter a different user name");

var users = [];
var todo_items = [];

function add_user(user_name, full_name, password){
    if (user_already_exist(user_name)){
        return setting.
    }
}
