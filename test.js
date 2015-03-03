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
var port = 8124;
var cookie = "";


//The options for the http require.
function getOptions(host, port, path, uname, pw, connection, contentLength, contentType, method, dataType, cookie) {
    return {
        host: host,
        port: port,
        path: path + (uname ? ("?user_name=" + uname + "&password=" + pw) : ""),
        headers: {
            'Connection': connection,
            'content-length': contentLength,
            'content-type': contentType,
            'cookie' : cookie
        },
        method: method,
        dataType: dataType
    };


}

// Test the server works well with a static handler - that it returns 200 for an existing file.
function check_wrong_login(){
    console.log('Start test check_wrong_login...');

    http.request(getOptions('localhost', '8124','/login', bad_user.uname, bad_user.pw, 'close', "", "", 'GET', 'json'), function (resp){
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

function check_good_register(){
    console.log('Start test check_good_register...');
    var user = JSON.stringify({full_name: "a", user_name: "a",
        password:"a", verify_password:"a"});
    http.request(getOptions('localhost', '8124','/register', "", "", 'close', user.length,  'application/json; charset=utf-8', 'POST', 'json')
        , function (resp){
            resp.on('data', function (data){
                if (resp.statusCode !== 200){
                    console.log('\tcheck_good_login got data and failed on ' + resp.statusCode);
                    return;
                }
                else {
                    console.log('\tcheck_good_register succeed');
                    return;
                }
            });
            resp.on('error',function (error){
                console.log('\tcheck_good_login failed on: ' + error);
            });
        }).end(user);
}

function check_good_login(){
    console.log('Start test check_good_login...');
    var buff = '';
    http.request(getOptions('localhost', '8124','/login', bad_user.uname, bad_user.pw, 'close', "", "", 'GET', 'json'), function (resp){
        resp.on('data', function (data){
            if (resp.statusCode === 200){
                buff += data;
            } else {
                console.log('\tcheck_good_login failed on ' + resp.statusCode);
            }
        });
        resp.on('end', function(){

            console.log('\tcheck_good_login succeeded');
        });
        resp.on('error',function (error){
            console.log('\tcheck_good_login failed on: ' + error);
        });
    }).end();
}

function check_bad_register(){
    console.log('Start test check_bad_register...');
    var user = JSON.stringify({full_name: "a", user_name: "a",
        password:"a", verify_password:"a"});
    http.request(getOptions('localhost', '8124','/register', "", "", 'close', user.length,  'application/json; charset=utf-8', 'POST', 'json')
        , function (resp){
        resp.on('data', function (data){
            if (resp.statusCode === 500){
                console.log('\tcheck_bad_register succeed');
                return;
            }
            else {
                console.log('\tcheck_bad_register got data and failed on ' + resp.statusCode);
                return;
            }
        });
        resp.on('error',function (error){
            console.log('\tcheck_bad_register failed on: ' + error);
        });
    }).end(user);

}

function check_adding_new_task(){
    console.log('Start test check_adding_new_task...');
    var task = "test ex5";
    var new_task = JSON.stringify({id: 0, value: task, completed: 0});

    http.request(getOptions('localhost', '8124','/login', bad_user.uname, bad_user.pw, 'close', "", "", 'GET', 'json'), function (resp){
        cookie = JSON.stringify(resp.headers["set-cookie"]);
        var cookie_list = cookie.split(",");
        var user_cookie = cookie_list[0].split(";")[0].split("\"")[1];
        var session_cookie = cookie_list[1].split(";")[0].split("\"")[1];
        cookie = user_cookie + "; " + session_cookie;
        resp.on('data', function (data){
            if (resp.statusCode === 200){
                console.log('\tcheck_good_login succeeded');
            } else {
                console.log('\tcheck_good_login failed on ' + resp.statusCode);
            }
        });
        resp.on('end', function(){
            http.request(getOptions('localhost', '8124','/item', "", "", 'close', new_task.length,  'application/json; charset=utf-8', 'POST', 'json', cookie)
                , function (resp){
                    resp.on('data', function (data){
                        if (resp.statusCode === 200){
                            console.log('\tcheck_adding_new_task succeed');
                            return;
                        }
                        else {
                            console.log(data + '\tcheck_adding_new_task got data and failed on ' + resp.statusCode);
                            return;
                        }
                    });
                    resp.on('end',function (){
                        http.request(getOptions('localhost', '8124','/item', "", "", 'close', "",  "", 'GET', 'json', cookie)
                            , function (resp){
                                resp.on('data', function (data){
                                    if (resp.statusCode === 200){
                                        console.log('\tcheck_get_existing_task succeed');
                                        return;
                                    }
                                    else {
                                        console.log(data + '\tcheck_adding_new_task got data and failed on ' + resp.statusCode);
                                        return;
                                    }
                                });
                                resp.on('error',function (error){
                                    console.log('\tcheck_adding_new_task failed on: ' + error);
                                });
                            }).end();

                    });
                    resp.on('error',function (error){
                        console.log('\tcheck_adding_new_task failed on: ' + error);
                    });
                }).end(new_task);
        });
        resp.on('error',function (error){
            console.log('\tcheck_good_login failed on: ' + error);
        });
    }).end();
}

function check_session_usage(){
    console.log('Start test check_adding_new_task...');
    var task = "stam";
    var new_task = JSON.stringify({id: 0, value: task, completed: 0});

    http.request(getOptions('localhost', '8124','/login', bad_user.uname, bad_user.pw, 'close', "", "", 'GET', 'json'), function (resp){
        cookie = JSON.stringify(resp.headers["set-cookie"]);
        var cookie_list = cookie.split(",");
        var user_cookie = cookie_list[0].split(";")[0].split("\"")[1];
        var session_cookie = cookie_list[1].split(";")[0].split("\"")[1];
        cookie = user_cookie + "; " + session_cookie;
        resp.on('data', function (data){

        });
        resp.on('end', function(){
            http.request(getOptions('localhost', '8124','/item', "", "", 'close', new_task.length,  'application/json; charset=utf-8', 'POST', 'json', "")
                , function (resp){
                    resp.on('data', function (data){
                        if (resp.statusCode === 500){
                            console.log('\tcheck_session_usage succeed');
                            return;
                        }
                        else {
                            console.log(data + '\tcheck_adding_new_task got data and failed on ' + resp.statusCode);
                            return;
                        }
                    });
                    resp.on('error',function (error){
                        console.log('\tcheck_adding_new_task failed on: ' + error);
                    });
                }).end(new_task);
        });
        resp.on('error',function (error){
        });
    }).end();
}

setTimeout(check_wrong_login, 1);
setTimeout(check_good_register, 100);
setTimeout(check_good_login, 300);
setTimeout(check_bad_register, 500);
setTimeout(check_adding_new_task, 700);
setTimeout(check_session_usage, 900);