var express = require('express');
var router = express.Router();


/* Controllers */
var instController = require('../controllers/inst-cont');
var adminController = require('../controllers/admin-cont');
var studentController = require('../controllers/student-cont');

var institutions = {"list":[]};

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

/* ******************** START INSTITUTION ******************** */
/* 8 GET Institution Login / Register page. */
router.get('/inst/login', instController.inst_login);

/* 14 GET Institution Register Success page. */
router.get('/inst/login/reg', instController.inst_login_reg);

/* 9 GET Institution Edit page. */
router.get('/inst/edit', instController.inst_edit);

/* 7 GET Instutution Home page. */
router.get('/inst/home', instController.inst);

/* 5 GET Institution Classes */
router.get('inst/home/class', instController.inst_classes);
/* ******************** END INSTITUTION ******************** */


/* ******************** START STUDENT ******************** */
/* 2 GET Student Login / Register page. */
router.get('/student/login', studentController.student_login);

/* 3 GET Student Search page. */
router.get('/student/search', studentController.student_search);

/* 4 GET Student Keyword Search Results page. */
router.get('/student/search/keyword', studentController.student_search_keyword);

/* 6 GET Student Location Search Results page. */
router.get('/student/search/location', studentController.student_search_location);
/* ******************** END STUDENT ******************** */


/* ******************** START ADMIN ******************** */
/* 10 GET Admin Login page. */
router.get('/admin/login', adminController.admin_login);

/* 11 GET Admin Search page. */
router.get('/admin/search', adminController.admin_search);

/* 16 GET Admin Search Results page. */
router.get('/admin/search/result', adminController.admin_search_results);

/* 12 GET Admin Manage page. ( For Approving and Denying Inst Registration Requests */
router.get('/admin/manage', adminController.admin_manage);

/* 13 GET Admin Manage Institution page. */
router.get('/admin/manage/inst', adminController.admin_manage_inst);

/* 15 GET Admin Add Institution page. */
router.get('/admin/add/inst', adminController.get_amdin_add_inst);

/* 15 POST Admin Add Institution page. */
router.post('/admin/add/inst', adminController.post_amdin_add_inst);
/* ******************** END ADMIN ******************** */

module.exports = router;
