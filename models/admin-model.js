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

exports.adminCheck = function (req,callback){
    options.path = '/admin/checkone/user?adminUserName=' + req.body.username;
    options.method = 'GET';
    options.headers = {"Content-Type": "application/json"};
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            return callback(chunk === 'true');
        });
    }).end();
};


exports.adminSave = function(user,callback){
    options.path = '/admin/add';
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

    bcrypt.genSalt(2, function(err, salt) {
        if (err) { return next(err); }
        bcrypt.hash(user.adminPWD, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.adminPWD = hash;
            request.write(JSON.stringify(user));
        });
    });


};

exports.adminFindByUserName = function(username, callback) {
    var err = null;
    options.path = '/admin/getone/user?adminUserName=' + username;
    options.method = 'GET';
    options.headers = {"Content-Type": "application/json"};

    console.log(options.path);
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            return callback(err, chunk);
        });
    }).end();
};

exports.compareAdminPassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch)  {
        return callback(err, isMatch);
    });
};

exports.isAdminPasswordValid = function(rawPassword,hash, callback) {
    //console.log(rawPassword);
    //console.log(hash);
    bcrypt.compare(rawPassword, hash, function(err, same) {
        //console.log('err - same');
        //console.log(err);
        //console.log(same);
        if (err) {
            return(callback(err));
        }
        return(callback(null, same));
    });
};