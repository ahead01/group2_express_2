

var http = require('http');
var config = require('../bin/config');
var instModel = require('../models/inst-model');
var passportConfig = require('../bin/passport-config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var classModel = require('../models/class-model');

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

exports.get_inst_add_class = function(req,res,next){
    res.render('inst/instAddClass', { title: 'Institution Add Class' });
};

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
    //console.log(req._parsedUrl.query);
    if(req._parsedUrl.query){
        var id = req._parsedUrl.query;
        instModel.instFindById(id,function(inst){
            console.log(inst);
            res.render('inst/instHome', { title: 'Institution Home', inst: inst });
        })
    }

};
exports.post_del_class = function(req,res,next){
    options.path = '/class/delete?classID=' + req.body.classID;
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
            console.log(data);
            res.redirect('/inst/home/class');
        })
    }).end();
};

exports.post_del_inst = function(req,res,next){
    options.path = '/inst/delete?institutionID=' + req.body.institutionID;
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
            console.log(data);
            res.redirect('/admin/manage');
        })
    }).end();
};

/* 5 GET Institution Classes */
exports.inst_classes =  function (req, res, next){
    options.path = '/class/getInstClass?institutionID=' + req.session.passport.user.institutionID;
    options.method = 'GET';
    console.log(options.path);
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

exports.inst_add_class = function(req,res,next){
    req.body.classInstitutionID = req.session.passport.user.institutionID;
    req.body.ClassInstitutionID = req.session.passport.user.institutionID;
    var myclass = req.body;
    var newClass = JSON.stringify(req.body);
    console.log('New Class: ' + newClass);


    classModel.class_add_one(myclass,function(res){
        console.log("inst_add_class: " + res);
    });
    res.render('inst/instAddClass', {title: 'Institution Add Class',msg:"SUCCESS!"});
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
                    res.redirect('/inst/login/reg');
                })
            }
        });
    });
};

exports.inst_update_desc = function(req, res, next){
    options.path = '/inst/update/desc?institutionID=' +req.body.institutionID + '&newVal=' + req.body.institutionDesc;
    options.path = encodeURI(options.path);
    options.method = 'GET';
    req.session.passport.user.institutionDesc = req.body.institutionDesc;

    console.log("URL");
    console.log(options.path);
    var data = "";
    http.request(options, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            data = data + chunk;
        }).on('end', function() {
               req.login(req.session.passport.user,function(err2) {
                   return res.render('inst/instEdit', { title: 'Institution Edit' });
                });
        })
    }).end();
};

exports.inst_update_email = function(req, res, next){
    options.path = '/inst/update/email?institutionID=' +req.body.institutionID + '&newVal=' + req.body.institutionEmail ;
    options.path = encodeURI(options.path);
    options.method = 'GET';
    req.session.passport.user.institutionEmail = req.body.institutionEmail;

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
            req.login(req.session.passport.user,function(err2) {
                return res.redirect('/inst/edit');
            });


        })
    }).end();
};