/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var hujinet = require('./hujinet');
var path = require('path');


/* Servers list */
var http_servers = [];
var server_id = 0;

function checkPathRelativity(dir) {
    var absolute,
        normal;
    absolute = path.resolve(dir);
    normal = path.normalize(dir);
    return normal !== absolute;
}

/* Start a new server and return its id */
exports.start = function (port, rootFolder, callback){
    var fixedRoot;
    if (!checkPathRelativity(rootFolder)) {
        fixedRoot = rootFolder;
    } else {
        fixedRoot = path.join(__dirname, rootFolder);

    }

    http_servers[server_id] = hujinet.getServer(port, fixedRoot, callback);
    http_servers[server_id].on('error', callback);
    return server_id++;
};

/* Close a server by its id */
exports.stop = function (server_id, callback){
    http_servers[server_id].close();
    http_servers[server_id].on('error', callback);
    console.log("Server closed");
};