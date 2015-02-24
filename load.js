/**
 * Created by Amit Abel and Golan Ben Ami


/* All requires */
var http = require('http');
var hujiserver = require('./hujiwebserver');

/* Server variables */
port = 8888;

hujiserver.start(port, function (e, server){
    e?(console.log(e)):(console.log('server is up'));
    if (typeof server !== 'undefined'){
        console.log("test.start");
        // First - create a static handler for the server and load it.
        server.use('/EX2', hujiserver.static('/www'));

        setTimeout(function (){
            console.log("Close server");
            server.stop();
        }, 7000);
    }
});


//The url we want is: 'localhost:8124/main.js'
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

function load_test(){
    var req;                                          // Given request
    var load_factor = 2000;    // The number of packets which were sent
    var load_counter = 0;   // The number of packets which were gotten
    var i;                                                  // Counter
    for (i = 0; i < load_factor; i++) {
        req = http.get(getOptions('localhost', '8888','/EX2/index.html','close'),
            function(resp){
                resp.on('data', function (data){
                    if (resp.statusCode === 200){
                        load_counter++;
                    }
                    if (load_counter === 2000){
                        console.log('load_test success :)');
                    } else if (load_counter < 2000 && i === 1999) {
                        console.log('load_test failed on load_counter: ' +
                        load_counter);
                    }
                });
                resp.on('error',function (error){
                    console.log('expect_404_test failed on: ' + error);
                });
            }).on('error', console.log);
    }
}

load_test();


