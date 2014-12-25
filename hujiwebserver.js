/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var hujinet = require('./hujinet');

/* Servers list */
var http_servers = [];
var server_id = 0;

/* Start a new server and return its id */
exports.start = function (port, rootFolder, callback){
    http_servers[server_id] = hujinet.getServer(port, rootFolder);
    http_servers[server_id].on('error', callback);
    return server_id++;
};

/* Close a server by its id */
exports.stop = function (server_id, callback){
    http_servers[server_id].close();
    http_servers[server_id].on('error', callback);
    console.log("Server closed");
};