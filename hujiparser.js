/**
 * Created by gbenami on 12/21/2014.
 */

var request = require('./httprequest');
var response = require('./httpresponse');

function trim(str){
    return ( str || '' ).replace( /^\s+|\s+$/g, '' );
}

function parse(req_string){
    var req_lines = req_string.split("\r\n");
    var http_req = new request.HttpRequest();
    var sep_loc = 0;
    var line_index = 0;
    http_req.method = req_lines[line_index].substring(0,req_lines[line_index].indexOf(" "));
    req_lines[line_index] = req_lines[line_index].substr(req_lines[line_index].indexOf(" ")+1);
    http_req.url = req_lines[line_index].substring(0,req_lines[line_index].indexOf(" "));
    req_lines[line_index] = req_lines[line_index].split("HTTP/")[1];
    http_req.http_ver = req_lines[line_index];
    line_index += 1;
    while ((line_index < req_lines.length) && (req_lines[line_index] != "")){
        sep_loc = req_lines[line_index].indexOf(":");
        http_req.request_fields[trim(req_lines[line_index].substring(0,sep_loc))] = trim(req_lines[line_index].substring(sep_loc+1));
        line_index += 1;
    }
    if (("Content-Length" in http_req.request_fields) && (http_req.request_fields["Content-Length"] != "0")){
        line_index += 1;
        http_req.message_body = "";
        http_req.message_body += req_lines[line_index++];
        while (line_index < req_lines.length){
            http_req.message_body += "\r\n";
            http_req.message_body += req_lines[line_index++];
        }
    }
    return http_req;
}

function stringify(res_object){

}

exports.parse = parse;

var tries = parse("POST /somepage.php HTTP/1.1\r\n\
Host: example.com\r\n\
Content-Type: application/x-www-form-urlencoded\r\n\
Content-Length: 19\r\n\r\n\r\n\
name=ruturajv&sex=m\r\n6767\r\n67676\r\n676767\r\n8686868\r\n6868686\r\n");
tries.print();