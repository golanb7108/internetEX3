/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All Requires */
var fs = require('fs');
var httpresponse = require('./httpresponse');
var hujiparser = require('./hujiparser');
var net = require('net');
var types = require('./mimetypes');
var util = require('util');
var event = require('events').EventEmitter;
var url = require('url');
var path = require('path');


/* Create new server on port */
var hujinet = function (handler){
    var myhujinet = this;

    myhujinet.server = net.createServer(function (socket){ //'connection' listener
        socket.setTimeout(2000);
        socket.on('data', function (data){



        });


        socket.on('timeout', function (){
            socket.end();
            socket.destroy();
        });
        socket.on('close', console.log);
        socket.on('error', console.log);
    });


    myhujinet.server.on('error', console.log);

    myhujinet.on('request', function(req, res) {
        handler(req, res);
    });

    myhujinet.listen = function(port){
        myhujinet.server.listen(port);
        console.log('server bound');
    };

    myhujinet.close = function(){
        myhujinet.server.close();
        myhujinet.emit('close');
    };
    event.call(myhujinet);
};

util.inherits(hujinet, event);
module.exports = hujinet;