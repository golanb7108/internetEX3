/**
 * Created by gbenami on 12/21/2014.
 */

var hujinet = require('./hujinet');

var http_server;


exports.start = function(port,rootFolder,callback)
{
    http_server = hujinet.getServer(port);
};

exports.stop = function() {
    http_server.close();
    console.log("Server closed");
};