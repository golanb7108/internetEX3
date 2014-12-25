/**
 * Created by aabel on 21-Dec-14.
 */

var HttpRequest = function (){
    this.method = null;
    this.url = null;
    this.http_ver = null;
    this.request_fields = {};
    this.message_body = null;
};

HttpRequest.prototype.print = function () {
    /*console.log(this.method);
    console.log(this.url);
    console.log(this.http_ver);
    console.log(this.request_fields);
    console.log(this.message_body);*/
    console.log(this);
};

exports.HttpRequest = HttpRequest;
