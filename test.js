/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var http = require('http'),
    server = require('./main'),
    bad_user = {
        fname : "a",
        uname : "a",
        pw : "a"
    },
    good_user = {
        fname : "b",
        uname : "b",
        pw : "b"
    };

/* Server variables */
port = 8124;


//The options for the http require.
function getOptions(host, port, path, connection, method, dataType, body) {
    return {
        host: host,
        port: port,
        path: path,
        headers: {
            'Connection': connection
        },
        method: method,
        dataType: dataType,
        body: body
    };
}

// Test the server works well with a static handler - that it returns 200 for an existing file.
function check_wrong_login(){
    console.log('Start test check_wrong_login...');

    http.request(getOptions('localhost', '8124','/login','close', 'POST', 'json',
        JSON.stringify({user_name:bad_user.uname, password:bad_user.pw})), function (resp){
        resp.on('data', function (data){
        if (resp.statusCode === 500){
                console.log('\tcheck_wrong_login succeeded');
        } else {
            console.log('\tcheck_wrong_login failed on ' + resp.statusCode);
        }
        });
        resp.on('error',function (error){
            console.log('\tcheck_wrong_login failed on: ' + error);
        });
    }).end();
}

function check_good_login(){
    console.log('Start test check_good_login...');

    http.request(getOptions('localhost', '8124','/register','close', 'POST', 'json',
        {full_name: "a", user_name: "a",
            password:"a", verify_password:"a"})
        , function (resp){
        resp.on('data', function (data){
            if (resp.statusCode !== 200){
                console.log('\tcheck_good_login failed on ' + resp.statusCode);
                return;
            }
        });
        resp.on('error',function (error){
            console.log('\tcheck_good_login failed on: ' + error);
        });
    }).end();

    http.request(getOptions('localhost', '8124','/login','close', 'POST', 'json',
        {user_name:"a", password:"a"}), function (resp){
        resp.on('data', function (data){
            if (resp.statusCode === 200){
                console.log('\tcheck_good_login succeeded');
            } else {
                console.log('\tcheck_good_login failed on ' + resp.statusCode);
            }
        });
        resp.on('error',function (error){
            console.log('\tcheck_good_login failed on: ' + error);
        });
    }).end();
}
check_wrong_login();
check_good_login();
