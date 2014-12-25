/**
 * Created by gbenami on 12/25/2014.
 */
var http = require('http');
var net = require('net');
var hujiserver = require('./hujiwebserver');
var port = 8214;

hujiserver.start(8124, 'EX2/', function(e){
    e?(console.log(e)):(console.log('server is up'));
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
    var req;

    req = http.get(getOptions('localhost', '8124','index.html','close'), function(resp){
        resp.on('data', function(data){
            if (resp.statusCode == 200){
                console.log('expect_success_test success :)');
            }
            else {
                console.log('expect_success_test failed on: ' + resp.statusCode);
            }
        });
        resp.on('error',function(error){
            console.log('expect_success_test failed on: ' + error);
        });
    });
}

function expect_404_test(){
    var req;

    req = http.get(getOptions('localhost', '8124','hujinet.js','close'), function(resp){
        resp.on('data', function(data){
            if (resp.statusCode == 404){
                console.log('expect_404_test success :)');
            }
            else {
                console.log('expect_404_test failed on: ' + resp.statusCode);
            }
        });
        resp.on('error',function(error){
            console.log('expect_404_test failed on: ' + error);
        });
    });
}


function wrong_string_test(){
    var resp;
    var con;
    con = net.createConnection(8124);
    con.setNoDelay();
    con.on('data', function (data) {
        resp = data.toString();
        if (resp.search('500')!= -1){
            console.log('wrong_string_test success:)');
        }
        else {
            console.log('wrong_string_test failed.');
        }
    });
    con.write('hi http server!!!');
}

function load_test(){
    var req;
    var load_factor = 500;
    var load_counter = 0;
    for (var i = 0; i < load_factor; i++) {
        req = http.get(getOptions('localhost', '8124','index.html','close'), function(resp){
            resp.on('data', function(data){
                if (resp.statusCode === 200){
                    load_counter++;
                }
                if (load_counter === 500){
                    console.log('load_test success :)');
                }
                else if (load_counter < 500 && i === 499) {
                    console.log('load_test failed on load_counter: ' + load_counter);
                }
            });
            resp.on('error',function(error){
                console.log('expect_404_test failed on: ' + error);
            });
        });
    }

}

/*Testing that the connection is kept-alive*/
function keep_alive_test(){
    var con;
    con = net.createConnection(8124);
    con.setNoDelay();
    con.on('data', function (data) {
    });

    setTimeout(function(){
        try {
            con.write('GET index.html HTTP/1.1\r\nHost: localhost\r\nConnection: keep-alive\r\n');
            console.log('keep_alive_test success :)');
        } catch(e) {
            console.log('keep_alive_test failed.');
            con.end();
        }
    }, 500);

    con.write('GET index.html HTTP/1.1\r\nHost: localhost\r\nConnection: keep-alive\r\n');

}

expect_success_test();
expect_404_test();
wrong_string_test();
load_test();
keep_alive_test();

setTimeout(function(){
    hujiserver.stop();
}, 7000);








/*








callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        console.log(str);
    });
};

var req = http.get(getOptions('localhost', '8124', 'main.js', 'close'), callback);
req.end();

req.on('error', function(e){
   console.log(e)
});

connection = net.createConnection(8124);
connection.setNoDelay();
connection.on('data', function (data) {
    //In this test we dont care what the response is
});

setTimeout(function(){
    try {
        connection.write('GET /ROOT/rooter.html HTTP/1.1\r\nHost: localhost\r\nConnection: keep-alive\r\n');
        console.log('Test 7 success!!');
    } catch(e) {
        console.log('Test 7 failed. Connection was not kept alive');
        connection.end();
    }
}, 500);

connection.write('GET /ROOT/rooter.html HTTP/1.1\r\nHost: localhost\r\nConnection: keep-alive\r\n');
*/


