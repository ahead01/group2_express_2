
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
var config = require('../bin/config');
var http = require('http');

var options = {
    host: config.servicehost,
    port: config.serviceport,
    path: '/',
    method: 'GET'
};

exports.studentCheck = function (req,callback){
    options.path = '/student/checkone/user?studentUserName=' + req.body.username;
    options.method = 'GET';
    options.headers = {"Content-Type": "application/json"};
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        var data = "";
        resp.on('data', function (chunk) {
            data = data + chunk;
        }).on('end', function(){
            console.log('BODY: ' + data);
            return callback(data === 'true');
        })
    }).end();
};

exports.studentSave = function(user,callback){
    options.path = '/student/add';
    options.method = 'POST';
    options.headers = {"Content-Type": "application/json"};
    var request = http.request(options, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            console.log('Response BODY: ' + chunk);
            //res.redirect('/student/search');
            if(chunk === 'Saved'){
                return callback(true);
            }
            return callback(false);
        });
    });

    console.log(user.password);
    console.log("pwd");

    bcrypt.genSalt(2, function(err, salt) {
        if (err) { return next(err); }
        bcrypt.hash(user.studentPWD, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.studentPWD = hash;
            request.write(JSON.stringify(user));
        });
    });


};

exports.studentFindByUserName = function(username, callback) {
    var err = null;
    options.path = '/student/getone/user?studentUserName=' + username;
    options.method = 'GET';
    options.headers = {"Content-Type": "application/json"};
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        var data = "";
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            data = data + chunk;
        }).on('end',function(){
            data = JSON.parse(data);
            return callback(err, data);
        })
    }).end();
};

exports.compareStudentPassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch)  {
        return callback(err, isMatch);
    });
};

exports.isStudentPasswordValid  = function(rawPassword,hash, callback) {
    //console.log(rawPassword);
    //console.log(hash);
    bcrypt.compare(rawPassword, hash, function(err, same) {
        console.log('err - same');
        console.log(err);
        console.log(same);
        if (err) {
            return(callback(err));
        }
        return(callback(null, same));
    });
};