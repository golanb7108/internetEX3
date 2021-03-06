/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var http = require('http');
var net = require('net');
var hujiserver = require('./hujiwebserver');

/* Server variables */
var port = 8124;
var server_id = 0;

server_id = hujiserver.start(port, '/EX2', function (e){
    e?(console.log(e)):(console.log('Server is up'));
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
    http.get(getOptions('localhost', '8124','/index.html','close'),
            function (resp){
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

function expect_404_test(){
    http.get(getOptions('localhost', '8124','/hujinet.js','close'),
            function(resp){
        resp.on('data', function (data){
            if (resp.statusCode === 404){
                console.log('expect_404_test success :)');
            } else {
                console.log('expect_404_test failed on: ' + resp.statusCode);
            }
        });
        resp.on('error',function (error){
            console.log('expect_404_test failed on: ' + error);
        });
    });
}

function wrong_string_test(){
    var resp; // Given response
    var con;      // Connection
    con = net.createConnection(port);
    con.setNoDelay();
    con.on('data', function (data) {
        resp = data.toString();
        if (resp.search('500')!= -1){
            console.log('wrong_string_test success:)');
        } else {
            console.log('wrong_string_test failed.');
        }
    });
    con.write('hi http server!!!');
}



/*Testing that the connection is kept-alive*/
function keep_alive_test(){
    var con; // Connection
    con = net.createConnection(port);
    con.setNoDelay();
    con.on('data', function (data){
    });

    setTimeout(function (){
        try {
            con.write('GET index.html HTTP/1.1\r\nHost: localhost\r\n' +
                    'Connection: keep-alive\r\n');
            console.log('keep_alive_test success :)');
        } catch(e) {
            console.log('keep_alive_test failed.');
            con.end();
        }
    }, 500);

    con.write('GET index.html HTTP/1.1\r\nHost: localhost\r\nConnection: ' +
            'keep-alive\r\n');

}

/* Run all tests */
expect_success_test();
expect_404_test();
wrong_string_test();
keep_alive_test();

setTimeout(function (){
    hujiserver.stop(server_id, function (e){
        e?(console.log(e)):(console.log('server is down'));
    });
}, 5000);
