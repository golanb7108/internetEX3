/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var hujidynamicserver = require('./hujidynamicserver'),
    types = require('./mimetypes'),
    hujiparser = require('./hujiparser'),
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    settings = require('./settings');

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

/* Check if the dir path is also absolute path */
function checkPathRelativity(dir) {
    var absolute, // Absolute path
        normal;   // Normalized dir path
    absolute = path.resolve(dir);
    normal = path.normalize(dir);
    return normal !== absolute;
}

/* Return static handler */
exports.static = function (rootFolder){
    var fixedRoot;
    if (!checkPathRelativity(rootFolder)) {
        fixedRoot = rootFolder;
    } else {
        fixedRoot = path.join(__dirname, rootFolder);
    }
    return function(http_req, http_res, next){
        var file,                                                     // Asked file
            url_pathname,                                    // file's URL pathname
            type;                                                    // file's type
        http_res.general_headers["Date"] = new Date().toUTCString();
        url_pathname = url.parse(http_req.url).pathname;
        type = url_pathname.substr(url_pathname.lastIndexOf("."));
        http_res.entity_headers["Content-Type"] = types.get_type(type);
        file = fixedRoot + path.normalize(url_pathname);
        fs.readFile(file, function (err, data) {
            if (err) {
                http_res.status_code = "404";
                http_res.reason_phrase = settings.STATUS_PHRASES[404];
                http_res.entity_headers["Content-Type"] = "text/plain";
                http_res.general_headers["Connection"] = "close";
                http_res.message_body = "The requested URL " + file +
                " was not found on this server";
                http_res.send();
                next();
            }
            else {
                http_res.send(data.toString());
            }
        });
    }
};

/* return my use handler */
exports.myUse = function (){
    var func =  function(request,response,next){
        var cookies_list,   //a list of "name=value" cookie strings
            cookie_num;       // one pair of "name=value" cookie string
        try {
            cookies_list = request.get('Cookie').split(';');
            for (cookie_num in cookies_list){
                response.cookie(hujiparser.trim(cookies_list[cookie_num].split('=')[0]),
                        hujiparser.trim(cookies_list[cookie_num].split('=')[1]), null);
            }
            return next();
        }
        catch(e){
            return next(e);
        }
    };
    // Explanation of myUse purpose.
    func.toString = function (){
        return "This method returns an handler that for each cookie in the given request, " +
            "the handler set a temporary cookie in the response with default root path.\n" +
            "This handler is needed for setting request cookies in easy and efficient way, " +
            "without adding new parameters to it.\nThe method doesn't require arguments.";
    };
    return func;
};