/**
 * Created by Amit Abel and Golan Ben Ami
 */

var settings = require('settings');

/* HttpRequest constructor */
var HttpRequest = function (){
    this.method = null;
    this.url = null;
    this.protocol = null;
    this.http_ver = null;
    this.request_fields = {};
    this.params = {};
    this.query = {};
    this.cookies = {};
    this.path = null;
    this.host = null;
    this.body = null;
    this.body_params = {};
    this.param = function (name, defaultValue){
        if (name in this.params){
            return this.params[name];
        } else if (name in this.body_params){
            return this.body_params[name];
        } else if (name in this.query){
            return this.query[name];
        } else if (defaultValue){
            return defaultValue;
        } else {
            throw settings.invalid_value_error;
        }
    };
    this.get = function (field){
        if (field in this.request_fields){
            return this.request_fields[field];
        }
        return null;
    };
    this.is = function (type){
        var req_type = this.get(settings.BODY_TYPE_HEADER);
        var patt = new RegExp(type);
        return patt.test(req_type);
    };
};

/* HttpRequest print */
HttpRequest.prototype.print = function (){
    console.log(this.method);
    console.log(this.url);
    console.log(this.protocol);
    console.log(this.http_ver);
    console.log(this.request_fields);
    console.log(this.params);
    console.log(this.query);
    console.log(this.cookies);
    console.log(this.path);
    console.log(this.host);
    console.log(this.body);
    console.log(this.body_params);
};

exports.HttpRequest = HttpRequest;
