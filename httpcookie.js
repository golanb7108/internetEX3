/**
 * Created by aabel on 01-Jan-15.
 */


var Cookie = function (value, options) {
    this.value = value;
    this.domain = ("domain" in options) ? options["domain"] : null;
    this.path = ("path" in options) ? options["path"] : null;
    this.secure = ("secure" in options) ? options["secure"] : null;
    this.expires = ("expires" in options) ? options["expires"] : null;
    this.maxAge = ("maxAge" in options) ? options["maxAge"] : null;
    this.httpOnly = ("httpOnly" in options) ? options["httpOnly"] : null;
    this.signed = ("signed" in options) ? options["signed"] : null;
};


exports.Cookie = Cookie;