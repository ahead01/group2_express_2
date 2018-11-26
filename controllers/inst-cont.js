var servicehost = 'localhost';
var serviceport = 8080;
var http = require('http');


var config = {
    host: servicehost,
    port: serviceport,
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
    res.render('inst/instEdit', { title: 'Institution Edit' });
};

/* 7 GET Instutution Home page. */
exports.inst =  function(req, res, next) {
    res.render('inst/instHome', { title: 'Institution Home' });
};

/* 5 GET Institution Classes */
exports.inst_classes =  function (req, res, next){
    res.render('inst/instClass', {title: 'Institution Classes'});
};