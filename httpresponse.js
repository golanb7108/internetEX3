/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* HttpResponse constructor */
var HttpResponse = function (){
    this.http_ver = null;
    this.status_code = null;
    this.reason_phrase = null;
    this.general_headers = {};
    this.response_headers = {};
    this.entity_headers = {};
    this.message_body = null;
};

/* HttpResponse print */
HttpResponse.prototype.print = function (){
    console.log(this.http_ver);
    console.log(this.status_code);
    console.log(this.reason_phrase);
    console.log(this.general_headers);
    console.log(this.response_headers);
    console.log(this.entity_headers);
    console.log(this.message_body);
};

exports.HttpResponse = HttpResponse;