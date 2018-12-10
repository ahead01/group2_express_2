var config = require('../bin/config');
var http = require('http');

var options = {
    host: config.servicehost,
    port: config.serviceport,
    path: '/',
    method: 'GET'
};

exports.findClasses = function (keyword, callback) {
    options.path = '/class/getsome?keyword=' + keyword;
    options.path = encodeURI(options.path);
    options.method = 'GET';
    //console.log(options);
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        var data = "";
        resp.on('data', function (chunk) {
            //console.log('Response BODY: ' + chunk);
            data = data + chunk;

        }).on('end', function(){
            data = JSON.parse(data);
            return callback(data);
        });
    }).end();
};


exports.class_add_one = function(myclass, callback){
    options.path = '/class/add';
    options.method = 'POST';
    options.headers = {"Content-Type": "application/json"};
    var request = http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            console.log('Response BODY: ' + chunk);
            return callback(chunk);
        });
    });

    request.write(JSON.stringify(myclass));


};