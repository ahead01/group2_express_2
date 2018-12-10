var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var http = require('http');
var config = require('../bin/config');
var studentModel = require('../models/student-model');
var adminModel = require('../models/admin-model');
var instModel = require('../models/inst-model');

var studentVar = 'student';
var instVar = 'inst';
var adminVar = 'admin';

var options = {
    host: config.servicehost,
    port: config.serviceport,
    path: '/',
    method: 'GET'
};
exports.authenticationStudentMiddleware = function (type) {
    return function(req, res, next) {
        var type = null;
        //console.log('req.session.passport' + req.session.passport);
        //console.log('req.session');
        //console.log(req.session.passport.user.type);
        //console.log('req.sessionStore.sessions' + req.sessionStore.sessions);
        if(req){
            if(req.session){
                if(req.session.passport){
                    if(req.session.passport.user){
                        if(req.session.passport.user.type){
                            type = req.session.passport.user.type;
                        }
                    }
                }
            }
        }


        console.log(next);
        if(type === studentVar){
            //console.log(req);
            if (req.isAuthenticated()){
                res.locals.user = req.user || null;
                return next();
            }
        }
        res.redirect('/');
    }
};

exports.authenticationAdminMiddleware = function (type) {
    return function(req, res, next) {
        var type = null;
        //console.log('req.session.passport' + req.session.passport);
        //console.log('req.session');
        //console.log(req.session.passport.user.type);
        //console.log('req.sessionStore.sessions' + req.sessionStore.sessions);
        if(req){
            if(req.session){
                if(req.session.passport){
                    if(req.session.passport.user){
                        if(req.session.passport.user.type){
                            type = req.session.passport.user.type;
                        }
                    }
                }
            }
        }
        console.log(next);
        if(type === adminVar){
            //console.log(req);
            if (req.isAuthenticated()){
                res.locals.user = req.user || null;
                return next();
            }
        }
        res.redirect('/');
    }
};

exports.authenticationInstMiddleware = function (type) {
    return function(req, res, next) {
        var type = null;
        //console.log('req.session.passport' + req.session.passport);
        //console.log('req.session');
        //console.log(req.session.passport.user.type);
        //console.log('req.sessionStore.sessions' + req.sessionStore.sessions);
        if(req){
            if(req.session){
                if(req.session.passport){
                    if(req.session.passport.user){
                        if(req.session.passport.user.type){
                            type = req.session.passport.user.type;
                        }
                    }
                }
            }
        }
        console.log(next);
        if(type === instVar){
            //console.log(req);
            if (req.isAuthenticated()){
                res.locals.user = req.user || null;
                return next();
            }
        }
        res.redirect('/');
    }
};

exports.authenticationMiddlewareOpposite = function() {
    return function(req, res, next) {

        //console.log('req.session.passport' + req.session.passport);
        //console.log('req.session' + req.session);

        if (req.isAuthenticated()) {
            res.redirect('/');
        }
        return next();

    }

};

passport.use(new LocalStrategy({usernameField: 'username',passwordField: 'password', passReqToCallback: true },
    function(req, username, password, done) {

    var url = req.url;

    if(url === '/student/sign-in'){
        studentModel.studentFindByUserName(username, function(err, student){
            if (err) { return done(err); }
            console.log('student: ' + student);
            if (student === 'null' || student === null) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            //student = JSON.parse(student);
            //console.log(student.studentPWD);
            studentModel.isStudentPasswordValid(password, student.studentPWD, function(err,result){
                if (err){
                    return done(null, false, { message: 'Incorrect password.' });
                }
                if (result === false){
                    return done(null, false, { message: 'Incorrect password.' });
                }
                student.password = student.studentPWD;
                student.username = student.studentUserName;
                student.type = studentVar;
                /*
                console.log('success student');
                console.log(err);
                console.log(result);
                console.log(student);
                */
                return done(err, student);
            });

        });
    }
    if(url === '/inst/sign-in'){
        instModel.instFindByUserName(username, function(err, inst){
            if (err) { return done(err); }
            console.log('inst: ' + inst);
            console.log(inst);
            if (inst === 'null' || inst === null) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            //inst = JSON.parse(inst);
            //console.log(inst.institutionPWD);
            instModel.isInstPasswordValid(password, inst.institutionPWD, function(err,result){
                if (err){
                    return done(null, false, { message: 'Incorrect password.' });
                }
                if (result === false){
                    return done(null, false, { message: 'Incorrect password.' });
                }
                inst.password = inst.institutionPWD;
                inst.username = inst.institutionName;
                inst.type = instVar;
                /*console.log('success inst');
                console.log(err);
                console.log(result);
                console.log(inst);
                */
                return done(err, inst);
            });

        });
    }
    if(url === '/admin/sign-in'){
        adminModel.adminFindByUserName(username, function(err, admin){
            if (err) { return done(err); }
            console.log('admin: ' + admin);
            if (admin === 'null' || admin === null) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            //admin = JSON.parse(admin);
            //console.log(admin.adminPWD);
            adminModel.isAdminPasswordValid(password, admin.adminPWD, function(err,result){
                if (err){
                    return done(null, false, { message: 'Incorrect password.' });
                }
                if (result === false){
                    return done(null, false, { message: 'Incorrect password.' });
                }
                admin.password = admin.adminPWD;
                admin.username = admin.adminUsername;
                admin.type = adminVar;
                //console.log('success admin');
                //console.log(err);
                //console.log(result);
                //console.log(admin);
                return done(err, admin);
            });

        });
    }


    }
));

passport.serializeUser(function(req, user,done) {
    //console.log("serializeUser: " );
    //console.log(user);
    //delete user.type;
    done(null, user);
    // done(null, user.id);
});


passport.deserializeUser(function( user, done) {
    //console.log("deserializeUser: " );
    //console.log(user);
    //done(user);
    if(user.type === 'student'){
        studentModel.studentFindByUserName(user.username, function(err, student){
            //console.log("INSIDE deserailze - find student byu username");
            //console.log(student);
            done(err, student);
        })
    }
    if(user.type ==='inst'){
        instModel.instFindByUserName(user.username, function(err, inst){
            //console.log(student);
            done(err, inst);
        })
    }
    if(user.type === 'admin'){
        adminModel.adminFindByUserName(user.username, function(err, admin){
            //console.log(student);
            done(err, admin);
        })
    }
});