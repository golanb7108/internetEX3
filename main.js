/**
 * Created by gbenami on 12/21/2014.
 */
var test = require("./hujiwebserver");


test.start(8124, function (e, server){
    e?(console.log(e)):(console.log('server is up'));
    if (typeof server !== 'undefined'){
        console.log("test.start");
        server.use('/', test.static('/EX2'));
    }
});
