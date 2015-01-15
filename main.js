/**
 * Created by Amit Abel and Golan Ben Ami
 */

var settings = require('./settings');
var todoitems = require('./todoitems');
var users = require('./users');
var uuid = require('node-uuid');
var hujiserver = require('./hujiwebserver');

/* Server variables */
port = 8124;

hujiserver.start(port,function(e, server) {
    e?(console.log(e)):(console.log('server is up'));
    if (typeof server !== 'undefined'){
        console.log("server start");
        server.use('/', hujiserver.static('/www'));
        server.post('/register', register);
        server.post('/login', login);

        server.get('/item', get_all_todo_items);
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
        response.send(200, settings.STATUS_PHRASES[200]);
    } catch (e) {
        response.status(500).send(e.message);
    }
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
            response.send(200, settings.STATUS_PHRASES[200]);
        }
    } catch (e) {
        response.status(500).send(e.message);
    }
}

function get_all_todo_items(request, response, next){
    var user_name;
    try {
        if ((request.cookies['user_name'] === undefined) || (request.cookies['sessionId'] === undefined)){
            throw settings.bad_request_format_error;
        }
        user_name = request.cookies['user_name'];
        get_user_by_session_id(request.cookies['sessionId'])
    } catch (e) {
        response.status(500).send(e.message);
    }
}


