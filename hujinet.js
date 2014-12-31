/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All Requires */
var fs = require('fs');
var httpresponse = require('./httpresponse');
var hujiparser = require('./hujiparser');
var net = require('net');
var types = require('./mimetypes');
var url = require('url');
var path = require('path');

var root; // The root directory

/* Check if the socket has to be closed after http request */
function check_close(http_req){
    if (http_req.request_fields["Connection"] &&
            http_req.request_fields["Connection"].toLowerCase() === "close"){
        return true;
    }
    if ((http_req.http_ver === '1.0') &&
            (http_req.request_fields["Connection"] &&
            http_req.request_fields["Connection"].toLowerCase() !==
            "keep-alive")){
        return true;
    }
    return false;
}

/* write response into socket and close the socket afterwards if needed */
function writeResp(response, socket , close_socket ){
    socket.write(response.toString(),'binary');
    socket.on('drain', function (){
        if (close_socket){
            socket.end();
        }
    });
}

/* Create new http response from http request */
function create_http_response(http_req, socket){
    var close_conn,                       // Check if socket needs to be closed
        http_res = new httpresponse.HttpResponse(), // New http response object
        file,                                                     // Asked file
        file_stream,                             // The stream of an asked file
        url_pathname,                                    // file's URL pathname
        type;                                                    // file's type
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
    url_pathname = url.parse(http_req.url).pathname;
    type = url_pathname.substr(url_pathname.lastIndexOf("."));
    http_res.entity_headers["Content-Type"] = types.get_type(type);
    http_res.http_ver = http_req.http_ver;
    http_res.general_headers["Connection"] =
            http_req.request_fields["Connection"];
    close_conn = check_close(http_req);
    file = path.join(__dirname, path.normalize(root + url_pathname));
    fs.stat(file, function (err, stats){
        var file_name;
        if (err) {
            http_res.status_code = "404";
            http_res.reason_phrase = "Not found";
            http_res.entity_headers["Content-Type"] = "text/plain";
            http_res.general_headers["Connection"] = "close";
            http_res.message_body = "The requested URL " + file +
                    " was not found on this server";
            writeResp(hujiparser.stringify(http_res), socket, true);
            return;
        }
        http_res.entity_headers["Content-Length"] = stats.size;
        switch (http_req.method) {
            case "GET":
                http_res.status_code = "200";
                http_res.reason_phrase = "OK";
        }
        writeResp(hujiparser.stringify(http_res), socket, close_conn);

        //send the file it self
        file_name = url.parse(http_req.url).pathname;
        file_name = file = path.join(__dirname, path.normalize(root + file_name));

        fs.exists(file_name, function (exists){
            if (exists){ 
                file_stream = fs.createReadStream(file_name);
                file_stream.pipe(socket, {end:close_conn});
            }
        });
    });
}

/* Create new server on port */
exports.getServer = function (port, rootFolder, callback){
    root = rootFolder;
    var server = net.createServer(function (socket){ //'connection' listener
        socket.setTimeout(2000);
        socket.on('data', function (data){
            var req_list = hujiparser.parse(data.toString()); // List of requests
            for (var i = 0; i < req_list.length ; i++){
                create_http_response(req_list[i], socket);
            }
        });

        socket.on('timeout', function (){
            socket.end();
            socket.destroy();
        });

        socket.on('close', function (){

        });

        socket.on('error', console.log);
    });

    server.on('error', callback);
    server.listen(port, function (){ //'listening' listener
        console.log('server bound');
    });
    return server;
};