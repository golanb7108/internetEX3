/**
 * Created by gbenami on 12/21/2014.
 */

var httprequest = require('./httprequest');
var httpresponse = require('./httpresponse');

var LINE_END = "\r\n";
var HTTP_STR = "HTTP/";
var BODY_LENGTH_HEADER = "Content-Length";
var METHODS_OPTIONS = ["GET","POST","PUT","DELETE","TRACE","OPTIONS","CONNECT"];

var not_finished_req;

function trim(str){
    return ( str || '' ).replace( /^\s+|\s+$/g, '' );
}

function is_a_method(value){
    for (var i = 0; i < METHODS_OPTIONS.length; i++){
        if (value == METHODS_OPTIONS[i]){
            return true;
        }
    }
    return false;
}

function parse(req_string){
    var req_lines = req_string.split(LINE_END);
    var req_header_tmp;
    var http_req_array = [];
    var current_req_index = 0;
    if (not_finished_req){
        req_lines = not_finished_req.concat(req_lines);
    }
    var line_index = 0;
    var new_req_index;
    var sep_loc;
    while (line_index < req_lines.length){
        if (req_lines[line_index] == ""){
            line_index += 1;
        }
        else {
            new_req_index = line_index;
            var http_req = new httprequest.HttpRequest();
            req_header_tmp = req_lines[line_index];
            http_req.method = req_header_tmp.substring(0,req_header_tmp.indexOf(" "));
            req_header_tmp = req_header_tmp.substr(req_header_tmp.indexOf(" ")+1);
            http_req.url = req_header_tmp.substring(0,req_header_tmp.indexOf(" "));
            req_header_tmp = req_header_tmp.split(HTTP_STR)[1];
            http_req.http_ver = req_header_tmp;
            line_index += 1;
//            console.log(req_lines[line_index].split(" ")[0]);
            while ((line_index < req_lines.length) && (req_lines[line_index] != "") && (!is_a_method(req_lines[line_index].split(" ")[0]))){
                sep_loc = req_lines[line_index].indexOf(":");
                http_req.request_fields[trim(req_lines[line_index].substring(0,sep_loc))] = trim(req_lines[line_index].substring(sep_loc+1));
                line_index += 1;
            }
            if ((BODY_LENGTH_HEADER in http_req.request_fields) && (http_req.request_fields[BODY_LENGTH_HEADER] != "0")){
                line_index += 1;
                http_req.message_body = "";
                http_req.message_body += req_lines[line_index++];
                while ((line_index < req_lines.length) && (http_req.message_body.length < parseInt(http_req.request_fields[BODY_LENGTH_HEADER]))){
                    http_req.message_body += LINE_END;
                    http_req.message_body += req_lines[line_index++];
                }
            }
            if ((BODY_LENGTH_HEADER in http_req.request_fields) && (http_req.message_body.length < parseInt(http_req.request_fields[BODY_LENGTH_HEADER]))){
                not_finished_req = "";
                while (new_req_index < req_lines.length) {
                    not_finished_req += req_lines[new_req_index++] + LINE_END;
                }
                return http_req_array;
            }
            http_req_array[current_req_index++] = http_req;
        }
    }
    not_finished_req = null;
    return http_req_array;
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
    if (res_object.message_body){
        response_str += res_object.message_body + LINE_END;
    }
    return response_str;
}

exports.parse = parse;
exports.stringify = stringify;

//var tries = parse("GET /players/mJordan/info.html HTTP/1.1\r\n\
//Host: www.nba.com\r\n\
//User-Agent: Mozilla/5.0 (Windows;) Gecko Firefox/3.0.4\r\n\
//Accept: text/html,application/xhtml+xml,application/xml\r\n\
//Accept-Language: en-us,en;q=0.5\r\n\
//X-cept-Encoding: gzip,deflate\r\n\
//Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7\r\n\
//Keep-Alive: 300\r\n\
//Connection: keep-alive\r\n\
//Referer: http://www.google.co.il/search?q=NBA Jordan 23\r\n\
//POST /somepage.php HTTP/1.1\r\n\
//Host: example.com\r\n\
//Content-Type: application/x-www-form-urlencoded\r\n\
//Content-Length: 19\r\n\r\n\
//name=ruturajv&sex=m\r\n");
//tries[1].print();
//console.log(not_finished_req);
//console.log(tries.length)

//var res = new httpresponse.HttpResponse();
//res.http_ver = "1.1";
//res.status_code = "200";
//res.reason_phrase = "OK";
//res.general_headers = {"one":"ones","two":"twos"};
//res.entity_headers = {"alpha":"alphas"};
//res.print();
//console.log(stringify(res));
