/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All Requires */
var test = require("./hujiwebserver");


test.start(8124, function (e, server){
    e?(console.log(e)):(console.log('server is up'));
    if (typeof server !== 'undefined'){
        console.log("test.start");
        server.use('/', test.static('/EX2'));
    }
});
