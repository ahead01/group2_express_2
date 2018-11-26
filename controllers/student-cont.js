var servicehost = 'localhost';
var serviceport = 8080;
var http = require('http');


var config = {
    host: servicehost,
    port: serviceport,
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

/* 4 GET Student Keyword Search Results page. */
exports.student_search_keyword = function(req, res, next) {
    config.path = '/class/getall';
    http.request(config, function(resp) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        //console.log(JSON.stringify(res.data));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            var courses = {'list':[]};
            courses.list = JSON.parse(chunk);
            console.log(courses);
            res.render('student/sdntSearchKey', { title: 'Student Keyword Search Results', results: courses });
        });
    }).end();

};

/* 6 GET Student Keyword Search Results page. */
exports.student_search_location = function(req, res, next) {
    res.render('student/sdntSearchLoc', { title: 'Student Location Search Results' });
};