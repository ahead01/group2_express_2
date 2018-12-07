var classModel = require('../models/class-model');
var studentModel = require('../models/student-model');
var config = require('../bin/config');
var http = require('http');

var options = {
    host: config.servicehost,
    port: config.serviceport,
    path: '/',
    method: 'GET'
};

/* 2 GET Student Login / Register page. */
exports.student_login = function(req, res, next) {
    res.render('student/sdntLogin', { title: 'Student Login' });
};

/* 3 GET Student Search page. */
exports.student_search = function(req, res, next) {
    res.render('student/sdntSearch', { title: 'Student Search' });
};

exports.post_student_search_keyword = function(req,res,next){
    console.log("STUDENT SEARCH KEYWORD POST");
    console.log(req.body.keyword);
    classModel.findClasses(req.body.keyword, function(data){
        var courses = {'list':[]};
        courses.list = data;
        console.log("Courses:");
        console.log(courses);
        res.render('student/sdntSearchKey', { title: 'Student Keyword Search Results', results: courses });
    });
};

/* 4 GET Student Keyword Search Results page. */
exports.student_search_keyword = function(req, res, next) {
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
            res.render('student/sdntSearchKey', { title: 'Student Keyword Search Results', results: courses });
        })
    }).end();

};

/* 6 GET Student Keyword Search Results page. */
exports.student_search_location = function(req, res, next) {
    res.render('student/sdntSearchLoc', { title: 'Student Location Search Results' });
};


exports.student_sign_up = function(req, res, next) {
       req.type = 'student';
    console.log('Signing up as a ' + req.type);
    console.log(req.body);
    studentModel.studentCheck(req, function(response){
        if(response === true){

        }
        studentModel.studentSave(req.body, function(response){
            if(response === true){
                req.logIn({username: req.body.studentUserName , password: req.body.studentPWD , type:req.type},function(err){
                    if(err){
                        console.log("Error During Login");
                        console.log(err.message);
                    }
                    console.log(req.user);
                    console.log(req.isAuthenticated());
                    res.locals.isAuthenticated = req.isAuthenticated();
                    res.redirect('/student/search');
                })
            }
        });
    });
};

exports.student_sign_in = function(req, res, next) {
    req.type = 'student';
    console.log('Signing in as a ' + req.type);
    console.log(req.body);
    req.logIn({username: req.body.studentUserName , password: req.body.studentPWD , type:req.type}, function(err){
        if(err){
            console.log("Error During Login");
            console.log(err.message);
        }
        console.log(req.user);
        console.log(req.isAuthenticated());
        res.locals.isAuthenticated = req.isAuthenticated();
    });


    res.redirect('/student/search');
};
