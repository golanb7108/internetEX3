/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var http = require('http');
var net = require('net');
var hujiserver = require('./hujiwebserver');

/* Server variables */
port = 8124;

hujiserver.start(port, function (e, server){
    e?(console.log(e)):(console.log('server is up'));
    if (typeof server !== 'undefined'){
        console.log("test.start");
        server.use('/EX2', hujiserver.static('/www'));
    }
});


//The url we want is: 'localhost:8124/main.js'
function getOptions(host, port, path, connection) {
    return {
        host: host,
        port: port,
        path: path,
        headers: {
            'Connection': connection
        }
    };
}


function expect_success_test(){
    http.get(getOptions('localhost', '8124','/EX2/index.html','close'), function (resp){
            resp.on('data', function (data){
                if (resp.statusCode === 200){
                    console.log('expect_success_test success :)');
                } else {
                    console.log('expect_success_test failed on: ' +
                    resp.statusCode);
                }
            });
            resp.on('error',function (error){
                console.log('expect_success_test failed on: ' + error);
            });
    });
}


expect_success_test();