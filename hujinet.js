/**
 * Created by gbenami on 12/21/2014.
 */

var net = require('net');
var hujiparser = require('./hujiparser');
var fs = require('fs');
var httpresponse = require('./httpresponse');

function set_field(field, val){
    this[field] = val;
}

function create_http_response(http_req){
    var http_res = new httpresponse.HttpResponse();
    http_res.http_ver = http_req.http_ver;
    switch (http_req.method) {
        case "GET":
            http_res.status_code = "200";
            http_res.reason_phrase = "OK";

    }
    http_res.status_code = null;
    http_res.reason_phrase = null;

    http_res.general_headers = {};
    http_res.response_headers = {};
    http_res.entity_headers = {};

    return http_res;
}

exports.getServer = function(port){
    var server = net.createServer(function(socket) { //'connection' listener
        console.log('server connected');

        socket.setNoDelay(noDelay=true);
        socket.write('Hello World!\r\n');
        socket.pipe(socket);

        socket.on('data', function(data) {
            console.log('Data was received');
            socket.write(data);
            var http_req = hujiparser.parse(data);
            var http_res = create_http_response(http_req);
            socket.write(hujiparser.stringify(http_res));
            if ((http_req.method == "GET") || (http_req.method == "POST")){
                var fileAsAstream = fs.createReadStream(url.parse(http_req.url).pathname);
                fileAsAstream.pipe(socket);
            }
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