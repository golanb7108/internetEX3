/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var httprequest = require('./httprequest');
var settings = require('settings');
var url = require('url');

var not_finished_req; //Contains a string of the last request which its body message
                      // didn't arrive in the last stream

/* Remove white spaces before and after given string */
function trim(str){
    return ( str || '' ).replace( /^\s+|\s+$/g, '' );
}

/* Check if given value is a appropriate method */
function is_a_method(value){
    var i; // Index
    for (i = 0; i < settings.METHODS_OPTIONS.length; i++){
        if (value === settings.METHODS_OPTIONS[i]){
            return true;
        }
    }
    return false;
}

/* Check if given line is a header line */
function is_header_line(line){
    var parts = line.split(" "); // List of all header parts
    return ((parts.length === 3) && (is_a_method(parts[0])) &&
            (parts[2].indexOf(settings.HTTP_STR) != -1));
}

/* parse given request string and create new request object */
function parse(req_string){
    var current_req_index = 0,                       // Current request index
        end_index = 0,                    // Last line of the current request
        http_req,                                   // Current request object
        http_req_array = [], // Array of all the requests in the given string
        req_lines = req_string.split(settings.LINE_END), // List of all requests lines
        start_index = 0;                 // First line of the current request
    if (not_finished_req){
        req_lines = not_finished_req.concat(req_lines);
    }
    while (end_index < req_lines.length) {
        if (req_lines[end_index] === "") {
            end_index += 1;
        } else {
            end_index += 1;
            while (((end_index < req_lines.length)) &&
                    (!is_header_line(req_lines[end_index]))) {
                end_index += 1;
            }
            try {
                http_req = parse_request(req_lines.slice(start_index,
                        end_index));
            } catch (e) {
                if (e === settings.bad_request_format_error) {
                    http_req = new httprequest.HttpRequest();
                } else if (e === settings.not_finished_request_error) {
                    not_finished_req = "";
                    while (start_index < req_lines.length) {
                        not_finished_req += req_lines[start_index++] +
                            settings.LINE_END;
                    }
                    return http_req_array;
                } else {
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

/* Create single given request from string */
function parse_request(req_lines){
    var http_req = new httprequest.HttpRequest(),  // The new request object
        line_index = 0,                                // Current line index
        req_header_tmp = req_lines[line_index],            // temporary line
        url_header,                                            // URL Header
        sep_loc;                          // Index of ':' in header instance
    if (req_header_tmp.indexOf(" ") === -1){
        throw settings.bad_request_format_error;
    }
    http_req.method = req_header_tmp.substring(0,req_header_tmp.indexOf(" "));
    if (!is_a_method(http_req.method)){
        throw settings.bad_request_format_error;
    }
    req_header_tmp = req_header_tmp.substr(req_header_tmp.indexOf(" ")+1);
    if (req_header_tmp.indexOf(settings.HTTP_STR) === -1){
        throw settings.bad_request_format_error;
    }
    url_header = req_header_tmp.substring(0,
                req_header_tmp.indexOf(settings.HTTP_STR)-1);
    http_req.path = url.parse(url_header).pathname;
    http_req.query = url.parse(url_header).query;
    http_req.host = url.parse(url_header).hostname;
    req_header_tmp = req_header_tmp.split(settings.HTTP_STR)[1];
    if (!trim(req_header_tmp).match(settings.HTTP_VERSION_FORMAT)){
        throw settings.bad_request_format_error;
    }
    http_req.protocol = settings.HTTP_PROTOCOL;
    http_req.http_ver = req_header_tmp;
    line_index += 1;
    while ((line_index < req_lines.length) && (req_lines[line_index] != "") &&
            (!is_a_method(req_lines[line_index].split(" ")[0]))){
        sep_loc = req_lines[line_index].indexOf(":");
        if ((sep_loc === -1) || (sep_loc === 0) ||
                (sep_loc === req_lines[line_index].length-1)){
            throw settings.bad_request_format_error;
        }
        http_req.request_fields[trim(req_lines[line_index].substring(0,
                sep_loc))] = trim(req_lines[line_index].substring(sep_loc+1));
        line_index += 1;
    }
    if ((settings.BODY_LENGTH_HEADER in http_req.request_fields) &&
            (http_req.request_fields[settings.BODY_LENGTH_HEADER] != "0")){
        line_index += 1;
        if (line_index >= req_lines.length){
            throw settings.not_finished_request_error;
        }
        http_req.message_body = "";
        http_req.message_body += req_lines[line_index++];
        while ((line_index < req_lines.length) &&
                (http_req.message_body.length <
                parseInt(http_req.request_fields[settings.BODY_LENGTH_HEADER]))){
            http_req.message_body += settings.LINE_END;
            http_req.message_body += req_lines[line_index++];
        }
    }
    if ((settings.BODY_LENGTH_HEADER in http_req.request_fields) &&
            (http_req.message_body.length <
            parseInt(http_req.request_fields[settings.BODY_LENGTH_HEADER]))){
        throw settings.not_finished_request_error;
    }
    return http_req;
}

exports.parse = parse;

