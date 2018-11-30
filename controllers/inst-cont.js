

var http = require('http');
var config = require('../bin/config');
var instModel = require('../models/inst-model');
var passportConfig = require('../bin/passport-config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var options = {
    host: config.servicehost,
    port: config.serviceport,
    path: '/',
    method: 'GET'
};

function debug(err, res, req){
    console.log(req.body);
    console.log(err);
    res.render('error', {title: "Error", error: err, req: req});
}

/* 8 GET Institution Login / Register page. */
exports.inst_login = function(req, res, next) {
    res.render('inst/instLogin', { title: 'Institution Login' });
};

/* 14 GET Institution Register Success page. */
exports.inst_login_reg = function(req, res, next) {
    res.render('inst/instRegistered', { title: 'Thank You For Registring!',message: ' Your registration will be processed within the next 24 business hours.' });
};

/* 9 GET Institution Edit page. */
exports.inst_edit =  function(req, res, next) {
    console.log(req.session.passport.user);
    res.render('inst/instEdit', { title: 'Institution Edit' });
};

/* 7 GET Instutution Home page. */
exports.inst =  function(req, res, next) {
    res.render('inst/instHome', { title: 'Institution Home' });
};

/* 5 GET Institution Classes */
exports.inst_classes =  function (req, res, next){
    options.path = '/class/getall';
    options.method = 'GET';
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        var data = "";
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            data = data + chunk;

        }).on('end', function() {
            var courses = {'list':[]};
            courses.list = JSON.parse(data);
            console.log(courses);
            res.render('inst/instClass', {title: 'Institution Classes', results: courses });
        })
    }).end();


};

exports.inst_sign_in = function(req, res, next){
    req.body.type = 'inst';
    console.log('sign in type:' + req.body.type);
    req.redirect('/inst/sign-in');
   // //console.log('Signing in as a ' + req.type);
    //console.log(req.body);
    //req.logIn({username: req.body.username , password: req.body.password , type:req.type}, function(err){
    //    if(err){
    //        console.log("Error During Login");
    //        console.log(err.message);
    //    }
    //    console.log(req.user);
    //    console.log(req.isAuthenticated());
    //    res.locals.isAuthenticated = req.isAuthenticated();
    //    res.redirect('/inst/edit');
    //});

};
exports.inst_sign_up = function(req, res, next){
    req.type = 'inst';
    req.body.institutionApproved = 0;
    console.log('Signing up as a ' + req.type);
    console.log(req.body);
    instModel.instCheck(req, function(response){
        if(response === true){
            res.redirect('/inst/login');
        }
        instModel.instAddOne(req.body, function(response){
            if(response === 'Saved'){
                req.logIn({username: req.body.instUserName , password: req.body.instPWD , type:req.type, approved: req.body.approved},function(err){
                    if(err){
                        console.log("Error During Login");
                        console.log(err.message);
                    }
                    console.log(req.user);
                    console.log(req.isAuthenticated());
                    res.locals.isAuthenticated = req.isAuthenticated();
                    res.redirect('/inst/edit');
                })
            }
        });
    });
};

exports.inst_update_desc = function(req, res, next){
    options.path = '/inst/update/desc?institutionID=' +req.body.institutionID + '&newVal=' + req.body.institutionDesc;
    options.path = encodeURI(options.path);
    options.method = 'GET';

    console.log("URL");
    console.log(options.path);
    var data = "";
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            data = data + chunk;
        }).on('end', function() {
            console.log(data);
            console.log("DATA");

            res.redirect('/inst/edit');
        })
    }).end();
};

exports.inst_update_email = function(req, res, next){
    options.path = '/inst/update/email?institutionID=' +req.body.institutionID + '&newVal=' + req.body.institutionEmail ;
    options.path = encodeURI(options.path);
    options.method = 'GET';

    console.log("URL");
    console.log(options.path);
    var data = "";
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            data = data + chunk;
        }).on('end', function() {
            console.log(data);
            console.log("DATA");

            res.redirect('/inst/edit');
        })
    }).end();
};