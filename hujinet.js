/**
 * Created by gbenami on 12/21/2014.
 */

var net = require('net');
var hujiparser = require('./hujiparser');
var fs = require('fs');

exports.getServer = function(port){
    var server = net.createServer(function(socket) { //'connection' listener
        console.log('server connected');

        socket.setNoDelay(noDelay=true);
        socket.write('Hello World!\r\n');
        socket.pipe(socket);

        socket.on('data', function(data) {
            console.log('Data was received');
            var http_request = hujiparser.parse(data);

        });

        socket.on('end', function() {
            console.log('server disconnected');
        });
    });

    server.on('error', function (e) {
        if (e.code == 'EADDRINUSE') {
            console.log('Address in use, retrying...');
            setTimeout(function () {
                server.close();
                server.listen(port, function() { //'listening' listener
                    console.log('server bound');
                });
            }, 1000);
        }
    });

    server.listen(port, function() { //'listening' listener
        console.log('server bound');
    });
    return server;
};