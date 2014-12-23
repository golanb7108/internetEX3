/**
 * Created by gbenami on 12/21/2014.
 */

var net = require('net');
var hujiparser = require('./hujiparser');
var fs = require('fs');
var httpresponse = require('./httpresponse');
var types = require('./mimetypes');
var url = require('url');
var root;
var socket;


function create_http_response(http_req){
    var http_res = new httpresponse.HttpResponse();
    var file;
    var url_pathname = url.parse(http_req.url).pathname;
    var type = url_pathname.substr(url_pathname.lastIndexOf("."));

    http_res.entity_headers["Content-Type"] = types.get_type(type);
    http_res.http_ver = http_req.http_ver;
    http_res.general_headers["Date"] = new Date().toUTCString();
    http_res.general_headers["Connection"] = http_req.request_fields["Connection"];
    file = '\/' + root + url_pathname;
    fs.stat(file, function (err, stats) {
        if (err) {
            http_res.status_code = "404";
            http_res.reason_phrase = "Not found";
            http_res.entity_headers["Content-Type"] = "text/plain";
            http_res.general_headers["Connection"] = "close";
            http_res.message_body = "The requested URL " + file + " was not found on this server"
            console.log("no file: " + err.message);

            socket.write(hujiparser.stringify(http_res));
            return;
        }
        http_res.entity_headers["Content-Length"] = stats.size;
        switch (http_req.method) {
            case "GET":
                http_res.status_code = "200";
                http_res.reason_phrase = "OK";
        }
        socket.write(hujiparser.stringify(http_res));

        if ((http_req.method == "GET") || (http_req.method == "POST")){
            var file_name = '\/' + root + url.parse(http_req.url).pathname
            fs.exists(file_name, function(exists){
                if (exists){
                    var file_stream = fs.createReadStream(file_name);
                    file_stream.pipe(socket);
                }

                file_stream.on('error', function (err){
                    http_res.status_code = "404";
                    http_res.reason_phrase = "Not found";
                    http_res.entity_headers["Content-Type"] = "text/plain";
                    http_res.general_headers["Connection"] = "close";
                    http_res.message_body = "The requested URL " + file_name + " was not found on this server"
                    console.log("error message: " + err.message);
                    socket.write(hujiparser.stringify(http_res));
                    return;
                });
            });
        }
    });
}


exports.getServer = function(port, rootFolder){
    var item;
    root = rootFolder;
    var server = net.createServer(function(in_socket) { //'connection' listener
        console.log('server connected');
        socket = in_socket;
        socket.on('data', function(data) {
            console.log('Data was received');
            //var req_list = hujiparser.parse(data.toString());
            //for (item in req_list) {create_http_response(item)}
            var http_req = hujiparser.parse(data.toString()); //TODO - check the output is valid, if not - send an indicator resp
            create_http_response(http_req);

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