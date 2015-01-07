/**
 * Created by aabel on 01-Jan-15.
 */

/* Error vars list */
exports.bad_request_format_error = new Error("The request is in bad format");
exports.not_finished_request_error = new Error("The request is not finished");
exports.invalid_value_error = new Error("Invalid parameter was asked");

/* Formats */
exports.LINE_END = "\r\n";
exports.HTTP_STR = "HTTP/";
exports.HTTP_PROTOCOL = "http";
exports.HTTP_VERSION_FORMAT = /1\.[0|1]/;
exports.BODY_LENGTH_HEADER = "Content-Length";
exports.BODY_TYPE_HEADER = "Content-Type";
exports.METHODS_OPTIONS = ["GET","POST","PUT","DELETE","TRACE","OPTIONS", "CONNECT"];
exports.STATUS_PHRASES = {200: "OK",
                          500: "Parsing error",
                          404: "Not found"};