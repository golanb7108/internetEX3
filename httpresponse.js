/**
 * Created by Amit Abel and Golan Ben Ami
 */

var settings = require('./settings');
var httpcookie = require('./httpcookie');
var types = require('./mimetypes');


/* HttpResponse constructor */
var HttpResponse = function (con_socket, connection_open){
    this.keep_alive = connection_open;
    this.socket = con_socket;
    this.http_ver = null;
    this.status_code = 200; // default value
    this.reason_phrase = settings.STATUS_PHRASES[200]; // default value
    this.cookies = {};
    this.general_headers = {};
    this.response_headers = {};
    this.entity_headers = {};
    this.message_body = null;

    this.toString = function (){
        var header,                          // Header instance
            cookie,                          // Cookie instance
            response_str = settings.HTTP_STR; // The new response string
        response_str += this.http_ver + " ";
        response_str += this.status_code.toString() + " ";
        response_str += this.reason_phrase + settings.LINE_END;
        for (header in this.general_headers){
            response_str += header + ": " + this.general_headers[header] +
                settings.LINE_END;
        }
        for (header in this.response_headers){
            response_str += header + ": " + this.response_headers[header] +
                settings.LINE_END;
        }
        for (header in this.entity_headers){
            response_str += header + ": " + this.entity_headers[header] +
                settings.LINE_END;
        }
        for (cookie in this.cookies){
            response_str += "Set-Cookie: " + cookie + "=" + this.cookies[cookie].toString() +
            settings.LINE_END;
        }
        response_str += settings.LINE_END;
        if (this.message_body){
            response_str += this.message_body +settings. LINE_END;
        }
        return response_str;
    };

    this.set  = function (field, value){
        if (typeof field === "object"){
            for (param in field){
                this.set(param, field[param]);
            }
        } else if (field in this.general_headers){
            this.general_headers[field] = value;
        } else if (field in this.response_headers){
            this.response_headers[field] = value;
        } else if (field in this.entity_headers){
            this.entity_headers[field] = value;
        } else {
            this.general_headers[field] = value;
        }
    };

    this.status = function (code){
        this.status_code = code;
        this.reason_phrase = settings.STATUS_PHRASES[code];
    };

    this.get = function (field){
        if (field in this.general_headers){
            return this.general_headers[field];
        } else if (field in this.response_headers){
            return this.response_headers[field];
        } else if (field in this.entity_headers){
            return this.entity_headers[field];
        } else {
            throw settings.invalid_value_error;
        }
    };

    this.cookie = function (name, value, options){
        var cookie_created = new httpcookie.Cookie(value, options);
        this.cookies[name] = cookie_created;
    };

    this.send = function (body){
        console.log(this.status_code);
        console.log(body.toString());

        if ((body !== undefined) && (body !== null)){
            if (typeof body === 'object') {
                return this.json(body);
            } else if (typeof body === 'buffer') {
                if (this.entity_headers[settings.BODY_TYPE_HEADER] === undefined) {
                    this.set(settings.BODY_TYPE_HEADER, types.get_type('.bin'));
                }
            } else {
                if (this.entity_headers[settings.BODY_TYPE_HEADER] === undefined) {
                    this.set(settings.BODY_TYPE_HEADER, types.get_type('.html'));
                }
            }
            this.message_body = (typeof body === 'number') ? body.toString() : body;
            if (this.entity_headers[settings.BODY_LENGTH_HEADER] === undefined) {
                var len = (this.message_body) ? this.message_body.length : 0;
                this.set(settings.BODY_LENGTH_HEADER, len);
            }
        }
        this.socket.write(this.toString(), 'binary');
        if (!this.keep_alive){
            this.socket.end();
        }
    };

    this.json = function (body){
        if (this.entity_headers[settings.BODY_TYPE_HEADER] === undefined) {
            this.set(settings.BODY_TYPE_HEADER, types.get_type('.json'));
        }
        this.send(JSON.stringify(body));
    };
};

/* HttpResponse print */
HttpResponse.prototype.print = function (){
    console.log(this.http_ver);
    console.log(this.status_code);
    console.log(this.reason_phrase);
    console.log(this.cookies);
    console.log(this.general_headers);
    console.log(this.response_headers);
    console.log(this.entity_headers);
    console.log(this.message_body);

};

exports.HttpResponse = HttpResponse;

