/**
 * Created by Amit Abel and Golan Ben Ami
 */

var settings = require('settings');
var httpcookie = require('httpcookie');


/* HttpResponse constructor */
var HttpResponse = function (){
    this.socket = null;
    this.http_ver = null;
    this.status_code = null;
    this.reason_phrase = null;
    this.cookies = {};
    this.general_headers = {};
    this.response_headers = {};
    this.entity_headers = {};
    this.message_body = null;
    this.set  = function (field, value){
        if (typeof field === "object"){
            for (param in field){
                this.set(param, field[param]);
            }
        } else if (field in this.general_headers){
            this.general_headers[field] = value;
        } else if (field in this.response_headers){
            this.response_headers[field] = value;
        } else if (field in this.entity_headers){
            this.entity_headers[field] = value;
        } else {
            this.general_headers[field] = value;
        }
    };
    this.status = function (code){
        this.status_code = code;
    };
    this.get = function (field){
        if (field in this.general_headers){
            return this.general_headers[field];
        } else if (field in this.response_headers){
            return this.response_headers[field];
        } else if (field in this.entity_headers){
            return this.entity_headers[field];
        } else {
            throw settings.invalid_value_error;
        }
    };
    this.cookie = function (name, value, options){
        var cookie_created = new httpcookie.Cookie(value, options);
        this.cookies[name] = cookie_created;
    };
    this.send = function (body){
        //todo: build it
    };
    this.json = function (body){
        //todo: build it
    };
};

/* HttpResponse print */
HttpResponse.prototype.print = function (){
    console.log(this.http_ver);
    console.log(this.status_code);
    console.log(this.reason_phrase);
    console.log(this.cookies);
    console.log(this.general_headers);
    console.log(this.response_headers);
    console.log(this.entity_headers);
    console.log(this.message_body);

};

exports.HttpResponse = HttpResponse;