/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var hujidynamicserver = require('./hujidynamicserver');


/* Start a new server and return its id */
exports.start = function (port, rootFolder, callback){
    new hujidynamicserver().listen(port);
};

exports.static = function(rootFolder)
{

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