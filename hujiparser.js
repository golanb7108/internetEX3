/**
 * Created by gbenami on 12/21/2014.
 */

var HttpRequest = function (){
    this.req_method = null;
    this.req_url = null;
    this.req_http_ver = null;
    this.req_fields = {};
    this.req_body = null;
};

HttpRequest.prototype.print = function () {
    console.log(this.req_method);
    console.log(this.req_url);
    console.log(this.req_http_ver);
    console.log(this.req_fields);
    console.log(this.req_body);
};

function trim(str){
    return ( str || '' ).replace( /^\s+|\s+$/g, '' );
}

function parse(req_string) {
    var req_lines = req_string.split("\\r\\n");
    var http_req = new HttpRequest();
    var sep_loc = 0;
    var line_index = 0;
    http_req.req_method = req_lines[line_index].substring(0,req_lines[line_index].indexOf(" "));
    tmp_string = req_lines[line_index].substr(req_lines[line_index].indexOf(" ")+1);
    http_req.req_url = req_lines[line_index].substring(0,req_lines[line_index].indexOf(" "));
    tmp_string = req_lines[line_index].substr(req_lines[line_index].indexOf("HTTP/")+1);
    http_req.req_http_ver = req_lines[line_index];
    line_index += 1;
    while (req_lines[line_index] != ""){
//        console.log(req_lines[line_index]);
        sep_loc = req_lines[line_index].indexOf(":");
        console.log(req_lines);

//        if (this.req_fields[trim(req_lines[line_index].substring(0,sep_loc))] === undefined)
//            this.req_fields[trim(req_lines[line_index].substring(0,sep_loc))] = [];
//        this.req_fields[trim(req_lines[line_index].substring(0,sep_loc))].push(req_lines[line_index].substring(sep_loc+1));
//        this.req_fields.push({
//            key:   trim(req_lines[line_index].substring(0,sep_loc)),
//            value: trim(req_lines[line_index].substring(sep_loc))
//        });

        http_req.req_fields[trim(req_lines[line_index].substring(0,sep_loc))] = trim(req_lines[line_index].substring(sep_loc+1));

//        this.req_fields["ss"] = "ssd";

        line_index += 1;
    }
    if (("Content-Length" in this.req_fields) && (this.req_fields["Content-Length"] != "0")){
        line_index += 2;
        http_req.req_body = "";
        while (line_index < req_lines.length){
            http_req.req_body += this.req_fields[line_index++];
        }
    }
    return http_req;
}

//exports.parse = parse;

var tries = parse("GET /amit HTTP/1.1\\r\\nHost: localhost:8888\\r\\nConnection: keep-alive\\r\\n \
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\\r\\n \
 User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36\\r\\n \
 Accept-Encoding: gzip, deflate, sdch\\r\\nAccept-Language: he-IL,he;q=0.8,en-US;q=0.6,en;q=0.4,fr;q=0.2)");
tries.print();