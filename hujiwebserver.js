/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var hujidynamicserver = require('./hujidynamicserver');


/* Start a new server and return its id */
exports.start = function (port, rootFolder, callback){
    var webserver = new hujidynamicserver();
    webserver.listen(port);
};

exports.static = function(rootFolder)
{
    return function(request, response, next){
        var close_conn,                       // Check if socket needs to be closed
            http_res = new httpresponse.HttpResponse(), // New http response object
            file,                                                     // Asked file
            file_stream,                             // The stream of an asked file
            url_pathname,                                    // file's URL pathname
            type;                                                    // file's type
        http_res.general_headers["Date"] = new Date().toUTCString();

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