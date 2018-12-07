var adminModel = require( "../models/admin-model");

var http = require('http');
var config = require('../bin/config');
var instModel = require('../models/inst-model');

var options = {
    host: config.servicehost,
    port: config.serviceport,
    path: '/',
    method: 'GET'
};


/* 10 GET Admin Login page. */
exports.admin_login = function(req, res, next) {
    res.render('admin/adminLogin', { title: 'Admin Login' });
};

/* 11 GET Admin Search page. */
exports.admin_search = function(req, res, next) {
    options.path = '/inst/getall';
    options.method = 'GET';
    var data = "";
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            data = data + chunk;
        }).on('end', function(){
            var institutions = {'list':[]};
            institutions.list = JSON.parse(data);
            //console.log(institutions);
            res.render('admin/adminSearch', { title: 'Admin Search', results: institutions });
        })
    }).end();
};

/* 16 GET Admin Search Results page. */
exports.admin_search_results = function(req, res, next) {
    res.render('admin/adminSearchResult', { title: 'Admin Search Results' });
};

/* 12 GET Admin Manage page. ( For Approving and Denying Inst Registration Requests */
exports.admin_manage =  function(req, res, next) {
    options.path = '/inst/getall';
    options.method = 'GET';
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
            //console.log(data);
           // console.log("DATA");
            var institutions = {'list':[]};
            institutions.list = JSON.parse(data);
            console.log(institutions);
            res.render('admin/adminManage', { title: 'Admin Management', results: institutions });
        })
    }).end();

};

/* 13 GET Admin Manage Institution page. */
exports.admin_manage_inst =  function(req, res, next) {
 instModel.getAllInstitutionsUnapproved(function(result){
     res.render('admin/adminManageInst', { title: 'Admin Manage Institution Requests', results: result });
 });

};

/* 15 GET Admin Add Institution page. */
exports.get_amdin_add_inst =  function(req, res, next) {
    res.render('admin/adminAddInst', { title: 'Admin Add Institution' });
};

/* 15 POST Admin Add Institution page. */
exports.post_amdin_add_inst =  function(req, res, next) {
    //console.log(req.body);
    req.body.institutionApproved = 1;
    var inst = req.body;
    delete inst.password2;
    var newInst = JSON.stringify(req.body);
    //console.log('New Inst: ' + newInst);
    instModel.instAddOne(inst,function(res){
        console.log("post_admin_add_inst: " + res);
    });
    res.redirect('/admin/manage/inst');


};

exports.admin_approve_inst = function(req, res, next) {
    console.log(req.body);
    options.path = '/admin/approveInst?approval=' + req.body.submit +'&id=' + req.body.id;
    options.method = 'GET';
    var data = "";
    http.request(options, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('Updated  ' + chunk + ' records');
            //res.redirect('/admin/manage/inst');
            data = data + chunk;
        }).on('end', function() {
            console.log('Updated  ' + chunk + ' records');
            res.redirect('/admin/manage/inst');
        })
    }).end();
};

exports.admin_sign_up = function(req,res,next){
    req.type = 'admin';
    console.log('Signing up as a ' + req.type);
    console.log(req.body);
    adminModel.adminCheck(req, function(response){
        if(response === true){


        }
        adminModel.adminSave(req.body, function(response){
            if(response === true){
                req.logIn({username: req.body.adminUsername , password: req.body.adminPWD , type:req.type},function(err){
                    if(err){
                        console.log("Error During Login");
                        console.log(err.message);
                    }
                    console.log(req.user);
                    console.log(req.isAuthenticated());
                    res.locals.isAuthenticated = req.isAuthenticated();
                    res.redirect('/admin/manage');
                })
            }
        });
    });


};
