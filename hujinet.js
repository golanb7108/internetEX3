/**
 * Created by gbenami on 12/21/2014.
 */

var net = require('net');
var hujiparser = require('./hujiparser');
var fs = require('fs');
var httpresponse = require('./httpresponse');
var types = require('./mimetypes');
var url = require('url');



function create_http_response(http_req){
    var http_res = new httpresponse.HttpResponse();
    http_res.http_ver = http_req.http_ver;
    http_res.general_headers["Date"] = new Date().toUTCString();
    http_res.general_headers["Connection"] = http_req.request_fields["Connection"];
    var url_pathname = url.parse(http_req.url).pathname;
    var type = url_pathname.substr(url_pathname.lastIndexOf("."));
    http_res.entity_headers["Content-Type"] = types.get_type(type);
    var stat = fs.statSync(url_pathname);
    http_res["Content-Length"] = stat["size"];

    switch (http_req.method) {
        case "GET":
            http_res.status_code = "200";
            http_res.reason_phrase = "OK";
    }

    return http_res;
}

exports.getServer = function(port){
    var server = net.createServer(function(socket) { //'connection' listener
        console.log('server connected');

        socket.on('data', function(data) {
            console.log('Data was received');
            console.log(data.toString());
            var http_req = hujiparser.parse(data.toString());
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

//http://localhost:8124/Users/aabel/WebstormProjects/internetEX3/main.js