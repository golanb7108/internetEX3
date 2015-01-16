/**
 * Created by Amit Abel and Golan Ben Ami
 */

var settings = require('./settings');
var todoitems = require('./todoitems');
var users = require('./users');
var uuid = require('node-uuid');
var hujiserver = require('./hujiwebserver');

/* Server variables */
var port = 8124;

hujiserver.start(port,function(e, server) {
    e?(console.log(e)):(console.log('server is up'));
    if (typeof server !== 'undefined'){
        console.log("server start");
        server.use('/', hujiserver.static('/www'));
        server.post('/register', register);
        server.post('/login', login);

        server.get('/item', get_all_todo_items);
        server.post('/item', add_item_to_todo_items);
        server.put('/item', update_item_in_todo_items);
        server.delete('/item', delete_item_in_todo_items);
    }
});

function register(request, response, next){
    var session_id,
        user_name;
    try {
        if (request.body_params === undefined){
            throw settings.bad_request_format_error;
        }
        session_id = uuid.v1();
        user_name = request.body_params['user_name'];
        users.add_user(user_name,request.body_params['full_name'],request.body_params['password'],
                request.body_params['verify_password'],session_id);
        todoitems.new_user_todo_list(user_name);
        response.cookie('user_name', user_name, {'expires':users.get_user_by_name(user_name).time_to_expire});
        response.cookie('sessionId', session_id, {'expires':users.get_user_by_name(user_name).time_to_expire});
        response.status(200).send(settings.STATUS_PHRASES[200]);
    } catch (e) {
        response.status(500).send(e.message);
        return settings.FAILURE;
    }
    return settings.SUCCESS;
}

function login(request, response, next){
    var password,
        session_id,
        user_name;
    try {
        if (request.body_params === undefined){
            throw settings.bad_request_format_error;
        }
        user_name = request.body_params['user_name'];
        password = request.body_params['password'];
        session_id = uuid.v1();
        if (users.try_to_login(user_name, password, session_id)){
            response.cookie('user_name', user_name, {'expires':users.get_user_by_name(user_name).time_to_expire});
            response.cookie('sessionId', session_id, {'expires':users.get_user_by_name(user_name).time_to_expire});
            response.status(200).send(settings.STATUS_PHRASES[200]);
        }
    } catch (e) {
        response.status(500).send(e.message);
        return settings.FAILURE;
    }
    return settings.SUCCESS;
}

function get_all_todo_items(request, response, next){
    var items,
        session_id,
        user_name;
    try {
        user_name = request.cookies['user_name'];
        session_id = request.cookies['sessionId'];
        if ((user_name === undefined) || (session_id === undefined)){
            throw settings.bad_request_format_error;
        }
        if (users.check_user_valid(user_name, session_id)){
            items = (todoitems.get_item_by_user(name).length > 0) ? todoitems.get_item_by_user(name): null;
            response.status(200).send(items);
        }
    } catch (e) {
        response.status(500).send(e.message);
    }
}

function add_item_to_todo_items(request, response, next){
    var session_id,
        task_id,
        task_value,
        user_name;
    try {
        user_name = request.cookies['user_name'];
        session_id = request.cookies['sessionId'];
        task_id = request.body_params['id'];
        task_value = request.body_params['title'];
        if ((user_name === undefined) || (session_id === undefined)
            || (task_id === undefined) || (task_value === undefined)){
            throw settings.bad_request_format_error;
        }
        if (users.check_user_valid(user_name, session_id)){
            todoitems.add_item_to_user(user_name, task_id, task_value);
            response.status(200).send(settings.STATUS_PHRASES[200]);
        }
    } catch (e) {
        response.status(500).send(e.message);
        return settings.FAILURE;
    }
    return settings.SUCCESS;
}

function update_item_in_todo_items(request, response, next){
    var session_id,
        task_id,
        task_value,
        task_status,
        user_name;
    try {
        user_name = request.cookies['user_name'];
        session_id = request.cookies['sessionId'];
        task_id = request.params['id'];
        task_value = request.params['title'];
        task_status = request.params['completed'];
        if ((user_name === undefined) || (session_id === undefined) || (task_id === undefined)){
            throw settings.bad_request_format_error;
        }
        if (users.check_user_valid(user_name, session_id)){
            todoitems.update_item_for_user(user_name, task_id, task_value, task_status);
            response.status(200).send(settings.STATUS_PHRASES[200]);
        }
    } catch (e) {
        response.status(500).send(e.message);
        return settings.FAILURE;
    }
    return settings.SUCCESS;
}

function delete_item_in_todo_items(request, response, next){
    var session_id,
        task_id,
        user_name;
    try {
        user_name = request.cookies['user_name'];
        session_id = request.cookies['sessionId'];
        task_id = request.params['id'];
        if ((user_name === undefined) || (session_id === undefined) || (task_id === undefined)){
            throw settings.bad_request_format_error;
        }
        if (users.check_user_valid(user_name, session_id)){
            if (task_id == settings.DELETE_ALL){
                todoitems.delete_all_items_for_user(user_name);
            } else {
                todoitems.delete_item_for_user(user_name, task_id);
            }
            response.status(200).send(settings.STATUS_PHRASES[200]);
        }
    } catch (e) {
        response.status(500).send(e.message);
        return settings.FAILURE;
    }
    return settings.SUCCESS;
}
