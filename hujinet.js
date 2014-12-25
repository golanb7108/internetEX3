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

function check_close(http_req){
    if (http_req.request_fields["Connection"] && http_req.request_fields["Connection"].toLowerCase() === "close"){
        return true;
    }
    if ((http_req.http_ver === '1.0') && ( http_req.request_fields["Connection"] && http_req.request_fields["Connection"].toLowerCase() === "keep-alive")){
        return false;
    }
    return false;
}


function writeResp(response, socket , close_socket ){
    socket.write(response.toString(),'binary');
    socket.on('drain', function(){
        if (close_socket){
            socket.end();
        }
    });
}

function create_http_response(http_req, socket){
    var http_res = new httpresponse.HttpResponse();
    var file;
    var url_pathname = url.parse(http_req.url).pathname;
    var type = url_pathname.substr(url_pathname.lastIndexOf("."));
    http_res.general_headers["Date"] = new Date().toUTCString();

    if (!http_req.method)
    {
        http_res.status_code = "500";
        http_res.reason_phrase = "Parsing error";
        http_res.entity_headers["Content-Type"] = "text/plain";
        http_res.general_headers["Connection"] = "close";
        http_res.message_body = "The request was corrupted.";
        writeResp(hujiparser.stringify(http_res), socket, true);
        return;
    }

    http_res.entity_headers["Content-Type"] = types.get_type(type);
    http_res.http_ver = http_req.http_ver;
    http_res.general_headers["Connection"] = http_req.request_fields["Connection"];
    var closeConn = check_close(http_req);
    file = root + url_pathname;
    fs.stat(file, function (err, stats) {
        if (err) {
            http_res.status_code = "404";
            http_res.reason_phrase = "Not found";
            http_res.entity_headers["Content-Type"] = "text/plain";
            http_res.general_headers["Connection"] = "close";
            http_res.message_body = "The requested URL " + file + " was not found on this server";
            console.log("no file: " + err.message);
            writeResp(hujiparser.stringify(http_res), socket, true);
            return;
        }
        http_res.entity_headers["Content-Length"] = stats.size;
        switch (http_req.method) {
            case "GET":
                http_res.status_code = "200";
                http_res.reason_phrase = "OK";
        }
        writeResp(hujiparser.stringify(http_res), socket, closeConn);


        //send the file it self
        var file_name = root + url.parse(http_req.url).pathname;
        fs.exists(file_name, function(exists){
            if (exists){
                var file_stream = fs.createReadStream(file_name);
                file_stream.pipe(socket);
            }


        });
    });
}


exports.getServer = function(port, rootFolder){
    root = rootFolder;
    var server = net.createServer(function(socket) { //'connection' listener
        console.log('server connected');
        socket.on('data', function(data) {
            socket.setTimeout(2000);

            console.log('Data was received');
            var req_list = hujiparser.parse(data.toString());
            for (var i = 0; i < req_list.length ; i++){
                create_http_response(req_list[i], socket);
            }
        });

        socket.on('timeout', function(){
            socket.end();
            socket.destroy();
        });

        socket.on('close', function() {
            console.log('server disconnected');
        });

        socket.on('error', console.log);
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
        if (e.code == 'ECONNRESET') {
            console.log('Address in use, retrying...');
            setTimeout(function () {
                server.close();
                server.listen(port, function() { //'listening' listener
                    console.log('server bound');
                });
            }, 1000);
        }
        console.log(e.code);
    });
    server.maxConnections = 1024;
    server.listen(port, function() { //'listening' listener
        console.log('server bound');
    });
    return server;
};