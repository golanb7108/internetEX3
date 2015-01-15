/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All Requires */
var settings = require('./settings');
var httpcookie = require('./httpcookie');
var types = require('./mimetypes');


/* HttpResponse constructor */
var HttpResponse = function (con_socket, connection_open){
    this.keep_alive = connection_open; // Is the response's socket should be kept open
    this.socket = con_socket;          // The response's socket
    this.http_ver = null;
    this.status_code = 200; // default value
    this.reason_phrase = settings.STATUS_PHRASES[200]; // default value
    this.cookies = {};
    this.general_headers = {};
    this.response_headers = {};
    this.entity_headers = {};
    this.message_body = null;

    // Return a string phrase of the response.
    this.toString = function (){
        var header,                           // Header instance
            cookie,                           // Cookie instance
            attribute,                        // A single attribute in a cookie's option
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
            response_str += "Set-Cookie: " + cookie + "=" + this.cookies[cookie].value;
            for (attribute in this.cookies[cookie].options){
                response_str += "; " + attribute;
                response_str += (this.cookies[cookie].options[attribute]) ?
                        ("=" + this.cookies[cookie].options[attribute]) : "" ;
            }
            response_str += settings.LINE_END;
        }
        if (this.message_body){
            response_str += settings.LINE_END;
            response_str += this.message_body +settings. LINE_END;
        }
        return response_str;
    };

    // Set header field to value, or pass an object to set multiple fields at once.
    this.set  = function (field, value){
        var param; // a parameter in field
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
            // Default area for params
            this.general_headers[field] = value;
        }
    };

    // Chainable alias of node's res.statusCode.
    // Use this method to set the HTTP status for the response.
    this.status = function (code){
        this.status_code = code;
        if (!(code in settings.STATUS_PHRASES)){
            this.reason_phrase = settings.STATUS_PHRASES[500];
        } else {
            this.reason_phrase = settings.STATUS_PHRASES[code];
        }
    };

    // Get the case-insensitive response header field.
    this.get = function (field){
        if (field in this.general_headers){
            return this.general_headers[field];
        } else if (field in this.response_headers){
            return this.response_headers[field];
        } else if (field in this.entity_headers){
            return this.entity_headers[field];
        } else {
            // In case the field doesn't exist in response
            throw settings.invalid_value_error;
        }
    };

    // Set cookie name to value, which may be a string or object converted to JSON.
    // The options object can have the following properties.
    this.cookie = function (name, value, options){
        var date_to_expire, // The day in which the cookie expire.
            cookie_created; // The new cookie object
        if ((name === undefined) || (name === null)) {
            return;
        }
        if ((options === undefined) || (options === null)){
            options = {}
        }
        date_to_expire = new Date(settings.DEFAULT_DATE);
        if ('maxAge' in options){
            if (parseInt(options['maxAge']) <= 0) {
                options['maxAge'] = 0;
            }
            date_to_expire = new Date(Date.now() + parseInt(options['maxAge']));
        }
        if (!('expires' in options)) {
            options['expires'] = date_to_expire;
        }
        if (!('path' in options)) {
            options['path'] = "/";
        }
        if ('secure' in options){
            options['secure'] = null;
        }
        if ('httpOnly' in options){
            options['httpOnly'] = null;
        }
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        cookie_created = new httpcookie.Cookie(value, options);
        this.cookies[name] = cookie_created;
    };

    // Send a response.
    this.send = function (body){
        if ((body !== undefined) && (body !== null)){
            if (typeof body === 'object') {
                return this.json(body);
            } else if (typeof body === 'buffer') {
                if (this.entity_headers[settings.BODY_TYPE_HEADER] === undefined){
                    this.set(settings.BODY_TYPE_HEADER, types.get_type('.bin'));
                }
            } else {
                if (this.entity_headers[settings.BODY_TYPE_HEADER] === undefined){
                    this.set(settings.BODY_TYPE_HEADER, types.get_type('.html'));
                }
            }
            this.message_body = (typeof body === 'number') ? body.toString() : body;
            if (this.entity_headers[settings.BODY_LENGTH_HEADER] === undefined){
                var len = (this.message_body) ? this.message_body.length : 0;
                this.set(settings.BODY_LENGTH_HEADER, len);
            }
        }

        this.socket.write(this.toString(), 'binary');

        // Close the socket after sending if it was requested
        this.socket.on('drain', function (){
            if (!this.keep_alive){
                this.socket.end();
            }
        });
    };

    // Send a JSON response.
    // This method is identical to res.send() when an object or array is passed.
    // However, it may be used for explicit JSON conversion of non-objects,
    // such as null, undefined, etc. (although these are technically not valid JSON).
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

