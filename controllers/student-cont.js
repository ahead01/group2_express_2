
var classModel = require('../models/class-model');
var studentModel = require('../models/student-model');
var instModel = require('../models/inst-model');
var config = require('../bin/config');
var http = require('http');

var options = {
    host: config.servicehost,
    port: config.serviceport,
    path: '/',
    method: 'GET'
};

exports.post_student_search_loc = function(req,res,next){
    /* Convert Search into lat and long using Google Maps Geocoding API */
    //var geocoder = new google.maps.Geocoder();
    console.log("post_student_search_loc");
    instModel.getAllInstitutions(function(institutions){
        console.log(institutions);
        institutions = institutions.list;
        var markers = [];
        for(var i = 0; i < institutions.length; i++){
            if(institutions[i].institutionLat && institutions[i].institutionLong){
                console.log("1");
                console.log(institutions[i]);
                var lat = Number(institutions[i].institutionLat);
                var lng = Number(institutions[i].institutionLong);
                if(lat !== "Nan" && lng !== "NaN"){
                    var marker =   {lat: lat, lng: lng, title: institutions[i].institutionName, label: institutions[i].institutionName, id: institutions[i].institutionID };
                    markers.push(marker);
                }
            }
        }
        var GeocoderRequest =
            {
                address: req.body.location,
                region: "US"
            };
        console.log(markers);
        res.render('student/sdntSearchLoc', { title: 'Student Search By Location', search: GeocoderRequest, markers: markers });
    });

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
        instModel.getAllInstitutions(function(data){
            var institutions = {};
            var length = data.list.length;
            var i;
            console.log(length);
            for (i =0; i < length ; i++){
                var temp = data.list[i];
                //console.log(temp);
                institutions[temp.institutionID] = temp;
            }
            console.log(institutions);
            console.log("INstitutions form post_student_search_eky");
            res.render('student/sdntSearchKey', { title: 'Student Keyword Search Results', results: courses, institutions: institutions });

        });

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


exports.student_view_inst_classes = function(req,res,next){
    console.log(req.query);
    options.path = '/class/getInstClass?' + req._parsedUrl.query;
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
            //console.log(courses);
            instModel.instFindById('id='+ req.query.institutionID, function(inst){
                console.log(inst);
                res.render('inst/instClass', {title: 'Institution '+ inst.institutionName  +' Classes', results: courses, institution: inst });
            });

        })
    }).end();

};