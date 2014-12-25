/**
 * Created by gbenami on 12/21/2014.
 */

var httprequest = require('./httprequest');

var LINE_END = "\r\n";
var HTTP_STR = "HTTP/";
var HTTP_VERSION_FORMAT = /1\.[0|1]/;
var BODY_LENGTH_HEADER = "Content-Length";
var METHODS_OPTIONS = ["GET","POST","PUT","DELETE","TRACE","OPTIONS","CONNECT"];

var not_finished_req;

var bad_request_format_error = new Error("The request is in bad format");
var not_finished_request_error = new Error("The request is not finished");

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

function is_header_line(line){
    var parts = line.split(" ");
    return ((parts.length == 3) && (is_a_method(parts[0])) && (parts[2].indexOf(HTTP_STR) != -1));
}

function parse(req_string){
    var req_lines = req_string.split(LINE_END);
    var http_req_array = [];
    var current_req_index = 0;
    if (not_finished_req){
        req_lines = not_finished_req.concat(req_lines);
    }
    var end_index = 0;
    var start_index = 0;
    var http_req;
    while (end_index < req_lines.length) {
        if (req_lines[end_index] == "") {
            end_index += 1;
        }
        else {
            end_index += 1;
            while (((end_index < req_lines.length)) && (!is_header_line(req_lines[end_index]))) {
                end_index += 1;
            }
            try {
                http_req = parse_request(req_lines.slice(start_index, end_index));
            }
            catch (e) {
                if (e == bad_request_format_error) {
                    http_req = new httprequest.HttpRequest();
                }
                else if (e == not_finished_request_error) {
                    not_finished_req = "";
                    while (start_index < req_lines.length) {
                        not_finished_req += req_lines[start_index++] + LINE_END;
                    }
                    return http_req_array;
                }
                else {
                    http_req = new httprequest.HttpRequest();
                }
            }
            http_req_array[current_req_index++] = http_req;
            start_index = end_index;
        }
    }
    not_finished_req = null;
    return http_req_array;
}

function parse_request(req_lines){
    var req_header_tmp;
    var sep_loc;
    var http_req = new httprequest.HttpRequest();
    var line_index = 0;
    req_header_tmp = req_lines[line_index];
    if (req_header_tmp.indexOf(" ") == -1){
        throw bad_request_format_error;
    }
    http_req.method = req_header_tmp.substring(0,req_header_tmp.indexOf(" "));
    if (!is_a_method(http_req.method)){
        throw bad_request_format_error;
    }
    req_header_tmp = req_header_tmp.substr(req_header_tmp.indexOf(" ")+1);
    if (req_header_tmp.indexOf(HTTP_STR) == -1){
        throw bad_request_format_error;
    }
    http_req.url = req_header_tmp.substring(0,req_header_tmp.indexOf(HTTP_STR)-1);
    req_header_tmp = req_header_tmp.split(HTTP_STR)[1];
    if (!trim(req_header_tmp).match(HTTP_VERSION_FORMAT)){
        throw bad_request_format_error;
    }
    http_req.http_ver = req_header_tmp;
    line_index += 1;
    while ((line_index < req_lines.length) && (req_lines[line_index] != "") && (!is_a_method(req_lines[line_index].split(" ")[0]))){
        sep_loc = req_lines[line_index].indexOf(":");
        if ((sep_loc == -1) || (sep_loc == 0) || (sep_loc == req_lines[line_index].length-1)){
            throw bad_request_format_error;
        }
        http_req.request_fields[trim(req_lines[line_index].substring(0,sep_loc))] = trim(req_lines[line_index].substring(sep_loc+1));
        line_index += 1;
    }
    if ((BODY_LENGTH_HEADER in http_req.request_fields) && (http_req.request_fields[BODY_LENGTH_HEADER] != "0")){
        line_index += 1;
        if (line_index >= req_lines.length){
            throw not_finished_request_error;
        }
        http_req.message_body = "";
        http_req.message_body += req_lines[line_index++];
        while ((line_index < req_lines.length) && (http_req.message_body.length < parseInt(http_req.request_fields[BODY_LENGTH_HEADER]))){
            http_req.message_body += LINE_END;
            http_req.message_body += req_lines[line_index++];
        }
    }
    if ((BODY_LENGTH_HEADER in http_req.request_fields) && (http_req.message_body.length < parseInt(http_req.request_fields[BODY_LENGTH_HEADER]))){
        throw not_finished_request_error;
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
    if (res_object.message_body){
        response_str += res_object.message_body + LINE_END;
    }
    return response_str;
}

exports.parse = parse;
exports.stringify = stringify;

//var tries = parse("GET /players/mJordan/info.html HTTP/1.0\r\n\
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
////console.log(tries.length)
//tries[0].print();
//var res = new httpresponse.HttpResponse();
//res.http_ver = "1.1";
//res.status_code = "200";
//res.reason_phrase = "OK";
//res.general_headers = {"one":"ones","two":"twos"};
//res.entity_headers = {"alpha":"alphas"};
//res.print();
//console.log(stringify(res));
