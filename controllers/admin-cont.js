var servicehost = 'localhost';
var serviceport = 8080;
var http = require('http');


var config = {
    host: servicehost,
    port: serviceport,
    path: '/',
    method: 'GET'
};





/* 10 GET Admin Login page. */
exports.admin_login = function(req, res, next) {
    res.render('admin/adminLogin', { title: 'Admin Login' });
};

/* 11 GET Admin Search page. */
exports.admin_search = function(req, res, next) {
    config.path = '/inst/getall';
    http.request(config, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            var institutions = {'list':[]};
            institutions.list = JSON.parse(chunk);
            console.log(institutions);
            res.render('admin/adminSearch', { title: 'Admin Search', results: institutions });
        });
    }).end();
};

/* 16 GET Admin Search Results page. */
exports.admin_search_results = function(req, res, next) {
    res.render('admin/adminSearchResult', { title: 'Admin Search Results' });
};

/* 12 GET Admin Manage page. ( For Approving and Denying Inst Registration Requests */
exports.admin_manage =  function(req, res, next) {
    config.path = '/inst/getall';
    http.request(config, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            var institutions = {'list':[]};
            institutions.list = JSON.parse(chunk);
            console.log(institutions);
            res.render('admin/adminManage', { title: 'Admin Management', results: institutions });
        });
    }).end();

};

/* 13 GET Admin Manage Institution page. */
exports.admin_manage_inst =  function(req, res, next) {
    config.path = '/inst/getall';
    http.request(config, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            var institutions = {'list':[]};
            institutions.list = JSON.parse(chunk);
            console.log(institutions);
            res.render('admin/adminManageInst', { title: 'Admin Manage Institution Requests', results: institutions });
        });
    }).end();

};

/* 15 GET Admin Add Institution page. */
exports.amdin_add_inst =  function(req, res, next) {
    res.render('admin/adminAddInst', { title: 'Admin Add Institution' });
};