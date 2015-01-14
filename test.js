/**
 * Created by Amit Abel and Golan Ben Ami
 */

/* All requires */
var http = require('http');
var hujiserver = require('./hujiwebserver');

/* Server variables */
port = 8124;

hujiserver.start(port, function (e, server){
    e?(console.log(e)):(console.log('server is up'));
    if (typeof server !== 'undefined'){
        console.log("test.start");
        // First - create a static handler for the server and load it.
        server.use('/EX2', hujiserver.static('/www'));
        // Second - create a test handler which checks the params analyzing.
        server.use('/www/:x', function(req, res, next){
            if (req.params['x'] === 'EX2'){
                console.log("Test check_params succeed");
            }
            next();
        });
        /*  Third, load a last test handler which checks if the next function works
            by verifying that it is activated.
         */
        server.use('/', function(req, res, next){
            console.log("Next test succeed");
            next();
        });
        setTimeout(function (){
            console.log("Close server");
            server.stop();
        }, 5000);
    }
});


//The options for the http require.
function getOptions(host, port, path, connection) {
    return {
        host: host,
        port: port,
        path: path,
        headers: {
            'Connection': connection
        }
    };
}

// Test the server works well with a static handler - that it returns 200 for an existing file.
function expect_success_test(){
    http.get(getOptions('localhost', '8124','/EX2/index.html','close'), function (resp){
        resp.on('data', function (data){
            if (resp.statusCode === 200){
                console.log('expect_success_test success :)');
            } else {
                console.log('expect_success_test failed on: ' +
                    resp.statusCode);
            }
        });
        resp.on('error',function (error){
            console.log('expect_success_test failed on: ' + error);
        });
    }).on('error', console.log);
}

// Test the server works well with a static handler - that it returns 404 for a missing file.
function expect_404_test(){
    http.get(getOptions('localhost', '8124','/EX2/kishkush.html','close'),
        function(resp){
            resp.on('data', function (data){
                if (resp.statusCode === 404){
                    console.log('expect_404_test success :)');
                } else {
                    console.log('expect_404_test failed on: ' + resp.statusCode);
                }
            });
            resp.on('error',function (error){
                console.log('expect_404_test failed on: ' + error);
            });
        }).on('error', console.log);
}

// Test the server works well with parsing the params - check the parsed param is correct.
function check_params(){
    http.get(getOptions('localhost', '8124','/www/EX2/index.html','close'), function (resp){
        resp.on('error',function (error){
            console.log('check_params failed on: ' + error);
        });
    }).on('error', console.log);
}


expect_success_test();
check_params();
expect_404_test();