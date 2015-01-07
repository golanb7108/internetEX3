/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var hujidynamicserver = require('./hujidynamicserver'),
    types = require('./mimetypes'),
    hujiparser = require('./hujiparser'),
    fs = require('fs'),
    path = require('path');


/* Start a new server and return its id */
exports.start = function (port, callback){
    var webserver;
    try {
        webserver = new hujidynamicserver();
        webserver.listen(port);
    }
    catch (e){
        callback(e, webserver);
    }
    callback(null, webserver);

};

exports.static = function(rootFolder)
{
    return function(http_req, http_res, next){
        var file,                                                     // Asked file
            url_pathname,                                    // file's URL pathname
            type;                                                    // file's type
        http_res.general_headers["Date"] = new Date().toUTCString();
        url_pathname = url.parse(http_req.url).pathname;
        type = url_pathname.substr(url_pathname.lastIndexOf("."));
        http_res.entity_headers["Content-Type"] = types.get_type(type);
        file = rootFolder + path.normalize(url_pathname);
        console.log(file);
        fs.readFile(file, function (err, data) {
            if (err) {
                http_res.status_code = "404";
                http_res.reason_phrase = "Not found";
                http_res.entity_headers["Content-Type"] = "text/plain";
                http_res.general_headers["Connection"] = "close";
                http_res.message_body = "The requested URL " + file +
                " was not found on this server";
                http_res.send();
                next();
            }
            else {
                http_res.send(data);
            }
        });
    }
};

exports.myUse = function()
{

};




















































/* Close a server by its id
exports.stop = function (server_id, handler){
    http_servers[server_id].close();
    http_servers[server_id].on('error', handler);
    console.log("Server closed");
};*/