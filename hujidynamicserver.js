/**
 * Created by gbenami on 1/1/2015.
 */

var path = require ('path');
var fs =  require('fs');
var net =  require('net');
var hujinet = require('./hujinet');

var hujidynamicserver = function ()
{
    var app = function(req, res, index){
        if (typeof index === 'undefined'){
            index = 0;
        }
        while (index < app.middleware.length){
            if (app.middleware[index].method === "USE" || app.middleware[index].method === req.method ){
                if (does_path_match(req.path, app.middleware[index].path)){
                    fill_params(req, app.middleware[index].path);
                    app.middleware[index].handler(req, res, function(){
                        app(req, res, index+1);
                    });
                }
            }
            index += 1;
        }
    };
    var server = new hujinet(app); //create a new huji net server
    // Defining local vars
    app.route = {};        // Holds all of the middleware functions by method
    app.middleware = [];    // Holds all of the middleware functions


    app.stop = function(){

    };
    app.use = function(resource, requestHandler){
        var middle;              // the middleware that would be defined
        if (typeof requestHandler === 'undefined') {
            middle = new middleware('use', '/', resource);
        }
        else{
            middle = new middleware('use', resource, requestHandler);
        }
        //push to the middle ware list.
        app.middleware.push(middle);

        //push to the list by method
        if(app.route['use'] === undefined)
                app.route['use'] = [];
        app.route['use'].push(middle);
    };
    app.get = function(resource, requestHandler){
        var middle;              // the middleware that would be defined
        if (typeof requestHandler === 'undefined') {
            middle = new middleware('get', '/', resource);
        }
        else{
            middle = new middleware('get', resource, requestHandler);
        }
        //push to the middle ware list.
        app.middleware.push(middle);

        //push to the list by method
        if(app.route['get'] === undefined)
            app.route['get'] = [];
        app.route['get'].push(middle);
    };
    app.post = function(resource, requestHandler){
        var middle;              // the middleware that would be defined
        if (typeof requestHandler === 'undefined') {
            middle = new middleware('post', '/', resource);
        }
        else{
            middle = new middleware('post', resource, requestHandler);
        }
        //push to the middle ware list.
        app.middleware.push(middle);

        //push to the list by method
        if(app.route['post'] === undefined)
            app.route['post'] = [];
        app.route['post'].push(middle);
    };
    app.delete = function(resource, requestHandler){
        var middle;              // the middleware that would be defined
        if (typeof requestHandler === 'undefined') {
            middle = new middleware('delete', '/', resource);
        }
        else{
            middle = new middleware('delete', resource, requestHandler);
        }
        //push to the middle ware list.
        app.middleware.push(middle);

        //push to the list by method
        if(app.route['delete'] === undefined)
            app.route['delete'] = [];
        app.route['delete'].push(middle);
    };
    app.put = function(resource, requestHandler){
        var middle;              // the middleware that would be defined
        if (typeof requestHandler === 'undefined') {
            middle = new middleware('put', '/', resource);
        }
        else{
            middle = new middleware('put', resource, requestHandler);
        }
        //push to the middle ware list.
        app.middleware.push(middle);

        //push to the list by method
        if(app.route['put'] === undefined)
            app.route['put'] = [];
        app.route['put'].push(middle);
    };
    app.listen = function(port){
        server.listen(port);
    };

    return app;
};

function fill_params(request, curr_use){
    var request_params = request.path.split('/');
    var use_params = curr_use.path.split('/');
    var index;
    for (index=0; index < request_params.length; index++){
        if(use_params[index].match(/:/g)){
            request.params[use_params[index].replace(':','')] = request_params[index];
        }
    }
}

function middleware(method, path, callback){
    this.method = method.toUpperCase();
    this.path = path;
    this.handler = callback;
};




function does_path_match(req_path, middleware_path){
    if(middleware_path.indexOf(':') === -1){
        var regex = new RegExp('^' + middleware_path, 'i');
        return regex.test(req_path);
    }
    else {
        var midd_path_list = middleware_path.split('\/');
        if (midd_path_list.length === 0) return true;

        var regex = "^";

        for (var i = 0; i < midd_path_list.length; i++) {
            if (midd_path_list[i] !== "") {
                regex += "\/";
                if (!midd_path_list[i].match(/:/g)) {
                    regex += midd_path_list[i];
                }
                else {
                    regex += "([^\/]+?)";
                }
            }
        }
        var theReg = new RegExp(regex, "i");
        return req_path.match(theReg);
    }
}


module.exports = hujidynamicserver;




