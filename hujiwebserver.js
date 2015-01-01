/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var hujinet = require('./hujinet');
var hujidynamicserver = require('./hujidynamicserver');

var hujiwebserver = function(){
    return hujidynamicserver;
};

/* Servers list */
var http_servers = [];
var server_id = 0;

/* Start a new server and return its id */
hujiwebserver.start = function (port, rootFolder, callback){
    http_servers[server_id] = hujinet.getServer(port, rootFolder, callback);
    http_servers[server_id].on('error', callback);
    return server_id++;
};

hujiwebserver.static = function(rootFolder)
{

};

hujiwebserver.myUse = function()
{

};




















































/* Close a server by its id
exports.stop = function (server_id, callback){
    http_servers[server_id].close();
    http_servers[server_id].on('error', callback);
    console.log("Server closed");
};*/