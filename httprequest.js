/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* HttpRequest constructor */
var HttpRequest = function (){
    this.method = null;
    this.url = null;
    this.http_ver = null;
    this.request_fields = {};
    this.message_body = null;
};

/* HttpRequest print */
HttpRequest.prototype.print = function (){
    console.log(this.method);
    console.log(this.url);
    console.log(this.http_ver);
    console.log(this.request_fields);
    console.log(this.message_body);
};

exports.HttpRequest = HttpRequest;
