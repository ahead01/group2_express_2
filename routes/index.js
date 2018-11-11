var express = require('express');
var router = express.Router();

var institutions = {"list":[
        {"name":"Public Institution 1","email":"sample@institution.edu","desc":"1Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit."},
        {"name":"Public Institution 2", "desc":"2Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit."},
        {"name":"Public Institution 3","desc":"3Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit."},
        {"name":"Public Institution 4","desc":"3Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit."}]};
var courses = {"list":[
        {"name":"Course Number 1","desc":"1Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.","seats":5,"inst":"Public Institution 1"},
        {"name":"Course Number 2","desc":"1Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.","seats":10,"inst":"Public Institution 1"},
        {"name":"Course Number 3","desc":"1Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.","seats":20,"inst":"Public Institution 3"},
        {"name":"Course Number 4","desc":"1Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.","seats":24,"inst":"Public Institution 4"}
    ]};

/* 1 GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Private Institution Marketing Application' });
});

/* 8 GET Institution Login / Register page. */
router.get('/inst/login', function(req, res, next) {
    res.render('inst/instLogin', { title: 'Institution Login' });
});

/* 14 GET Institution Register Success page. */
router.get('/inst/login/reg', function(req, res, next) {
    res.render('inst/instRegistered', { title: 'Thank You For Registring!',message: ' Your registration will be processed within the next 24 business hours.' });
});

/* 9 GET Institution Edit page. */
router.get('/inst/edit', function(req, res, next) {
    res.render('inst/instEdit', { title: 'Institution Edit' });
});

/* 7 GET Instutution Home page. */
router.get('/inst/home', function(req, res, next) {
    res.render('inst/instHome', { title: 'Institution Home' });
});

/* 5 GET Institution Classes */
router.get('inst/home/class', function (req, res, next){
    res.render('inst/instClass', {title: 'Institution Classes'})
});

/* 2 GET Student Login / Register page. */
router.get('/student/login', function(req, res, next) {
    res.render('student/sdntLogin', { title: 'Student Login' });
});

/* 3 GET Student Search page. */
router.get('/student/search', function(req, res, next) {
    res.render('student/sdntSearch', { title: 'Student Search' });
});

/* 4 GET Student Keyword Search Results page. */
router.get('/student/search/keyword', function(req, res, next) {
    res.render('student/sdntSearchKey', { title: 'Student Keyword Search Results',results: courses });
});

/* 6 GET Student Keyword Search Results page. */
router.get('/student/search/location', function(req, res, next) {
    res.render('student/sdntSearchLoc', { title: 'Student Location Search Results' });
});

/* 10 GET Admin Login page. */
router.get('/admin/login', function(req, res, next) {
    res.render('admin/adminLogin', { title: 'Admin Login' });
});

/* 11 GET Admin Search page. */
router.get('/admin/search', function(req, res, next) {
    res.render('admin/adminSearch', { title: 'Admin Search', results: institutions });
});

/* 16 GET Admin Search Results page. */
router.get('/admin/search/result', function(req, res, next) {
    res.render('admin/adminSearchResult', { title: 'Admin Search Results' });
});

/* 12 GET Admin Manage page. ( For Approving and Denying Inst Registration Requests */
router.get('/admin/manage', function(req, res, next) {
    res.render('admin/adminManage', { title: 'Admin Management', results: institutions });
});

/* 13 GET Admin Manage Institution page. */
router.get('/admin/manage/inst', function(req, res, next) {
    res.render('admin/adminManageInst', { title: 'Admin Manage Institution Requests', results: institutions });
});

/* 15 GET Admin Add Institution page. */
router.get('/admin/add/inst', function(req, res, next) {
    res.render('admin/adminAddInst', { title: 'Admin Add Institution' });
});


module.exports = router;
