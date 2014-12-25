/**
 * Created by gbenami on 12/25/2014.
 */
var http = require('http');
var net = require('net');
var hujiserver = require('./hujiwebserver');
var port = 8214;
/*
var options = {
    host: 'localhost',
    port: '8124',
    path: '/main.js',
    method: 'GET',
    headers: {
        'Connection': 'keep-alive'
    }
};
*/
console.log('Current directory: ' + process.cwd());

console.log(__dirname);
hujiserver.start(8124, '', function(e){
    e?(console.log(e)):(console.log('server is up'));
});

//The url we want is: 'localhost:8124/main.js'
function getOptions(host, port, path, connection) {
    return options = {
        host: host,
        port: port,
        path: path,
        headers: {
            'Connection': connection
        }
    };
}
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

setTimeout(function(){
    hujiserver.stop();
}, 6000);