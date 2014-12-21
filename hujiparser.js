/**
 * Created by gbenami on 12/21/2014.
 */

var httprequest = require('./httprequest');
var httpresponse = require('./httpresponse');

var LINE_END = "\r\n";
var HTTP_STR = "HTTP/";
var BODY_LENGTH_HEADER = "Content-Length";

function trim(str){
    return ( str || '' ).replace( /^\s+|\s+$/g, '' );
}

function parse(req_string){
    var req_lines = req_string.split(LINE_END);
    var http_req = new httprequest.HttpRequest();
    var sep_loc = 0;
    var line_index = 0;
    http_req.method = req_lines[line_index].substring(0,req_lines[line_index].indexOf(" "));
    req_lines[line_index] = req_lines[line_index].substr(req_lines[line_index].indexOf(" ")+1);
    http_req.url = req_lines[line_index].substring(0,req_lines[line_index].indexOf(" "));
    req_lines[line_index] = req_lines[line_index].split(HTTP_STR)[1];
    http_req.http_ver = req_lines[line_index];
    line_index += 1;
    while ((line_index < req_lines.length) && (req_lines[line_index] != "")){
        sep_loc = req_lines[line_index].indexOf(":");
        http_req.request_fields[trim(req_lines[line_index].substring(0,sep_loc))] = trim(req_lines[line_index].substring(sep_loc+1));
        line_index += 1;
    }
    if ((BODY_LENGTH_HEADER in http_req.request_fields) && (http_req.request_fields[BODY_LENGTH_HEADER] != "0")){
        line_index += 1;
        http_req.message_body = "";
        http_req.message_body += req_lines[line_index++];
        while (line_index < req_lines.length){
            http_req.message_body += LINE_END;
            http_req.message_body += req_lines[line_index++];
        }
    }
    return http_req;
}

function stringify(res_object){
    var response_str = HTTP_STR;
    var header;
    response_str += res_object.http_ver + " ";
    response_str += res_object.status_code + " ";
    response_str += res_object.reason_phrase + LINE_END;
    for (header in res_object.general_headers){
        response_str += header + ": " + res_object.general_headers[header] + LINE_END;
    }
    for (header in res_object.response_headers){
        response_str += header + ": " + res_object.response_headers[header] + LINE_END;
    }
    for (header in res_object.entity_headers){
        response_str += header + ": " + res_object.entity_headers[header] + LINE_END;
    }
    response_str += LINE_END;
    return response_str;
}

exports.parse = parse;
exports.stringify = stringify;

//var tries = parse("POST /somepage.php HTTP/1.1\r\n\
//Host: example.com\r\n\
//Content-Type: application/x-www-form-urlencoded\r\n\
//Content-Length: 19\r\n\r\n\
//name=ruturajv&sex=m\r\n6767\r\n67676\r\n676767\r\n8686868\r\n6868686\r\n");
//tries.print();

var res = new httpresponse.HttpResponse();
res.http_ver = "1.1";
res.status_code = "200";
res.reason_phrase = "OK";
res.general_headers = {"one":"ones","two":"twos"};
res.entity_headers = {"alpha":"alphas"};
res.print();
console.log(stringify(res));
