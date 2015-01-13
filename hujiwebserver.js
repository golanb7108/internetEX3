/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var hujidynamicserver = require('./hujidynamicserver'),
    types = require('./mimetypes'),
    hujiparser = require('./hujiparser'),
    fs = require('fs'),
    url = require('url'),
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

function checkPathRelativity(dir) {
    var absolute,
        normal;
    absolute = path.resolve(dir);
    normal = path.normalize(dir);
    return normal !== absolute;
}

exports.static = function (rootFolder){
    var fixedRoot;
    if (!checkPathRelativity(rootFolder)) {
        fixedRoot = rootFolder;
    } else {
        fixedRoot = path.join(__dirname, rootFolder);
    }
    return function(http_req, http_res, next){
        console.log("webserver.static");

        var file,                                                     // Asked file
            url_pathname,                                    // file's URL pathname
            type;                                                    // file's type
        http_res.general_headers["Date"] = new Date().toUTCString();
        url_pathname = url.parse(http_req.url).pathname;
        type = url_pathname.substr(url_pathname.lastIndexOf("."));
        http_res.entity_headers["Content-Type"] = types.get_type(type);
        file = fixedRoot + path.normalize(url_pathname);
        console.log("file name for static: " + file);
        fs.readFile(file, function (err, data) {
            if (err) {
                console.log("webserver.static.error");

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
                console.log("webserver.static.send");

                http_res.send(data.toString());
            }
        });
    }
};

exports.myUse = function (){
    var func =  function(request,response,next){
        var cookies_list,   //a list of "name=value" cookie strings
            cookie_num;       // one pair of "name=value" cookie string
        try {
            cookies_list = request.get('Cookie').split(';');
            for (cookie_num in cookies_list){
                response.cookie(hujiparser.trim(cookies_list[cookie_num].split('=')[0]),
                        hujiparser.trim(cookies_list[cookie_num].split('=')[1]), null);
                console.log("!!!!!!!!!!!!!!!");
                console.log(response.toString());
                console.log("!!!!!!!!!!!!!!!");
            }
            return next();
        }
        catch(e){
            return next(e);
        }
    };
    func.prototype.toString = function (){
        return "This method returns an handler that for each cookie in the given request, " +
            "the handler set a temporary cookie in the response with default root path.\n" +
            "This use is needed for setting request cookies in easy and efficient way, " +
            "without adding new parameters to it.\n The method doesn't require arguments.";
    };
    return func;
};