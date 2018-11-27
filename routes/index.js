var express = require('express');
var router = express.Router();
var passportConfig = require('../bin/passport-config');
var passport = require('passport');


/* Controllers */
var instController = require('../controllers/inst-cont');
var adminController = require('../controllers/admin-cont');
var studentController = require('../controllers/student-cont');


/* 1 GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Private Institution Marketing Application' });
});

/* ******************** START INSTITUTION ******************** */
/* 8 GET Institution Login / Register page. */
router.get('/inst/login', instController.inst_login);

router.post('/inst/sign-in',  passport.authenticate('local',{failureRedirect: '/inst/login', successRedirect: '/inst/edit'}), instController.inst_edit);

router.post('/inst/sign-up',instController.inst_sign_up);

/* 14 GET Institution Register Success page. */
router.get('/inst/login/reg', instController.inst_login_reg);

/* 9 GET Institution Edit page. */
router.get('/inst/edit', passportConfig.authenticationMiddleware(), instController.inst_edit);

/* 7 GET Instutution Home page. */
router.get('/inst/home', instController.inst);

/* 5 GET Institution Classes */
router.get('inst/home/class', instController.inst_classes);
/* ******************** END INSTITUTION ******************** */


/* ******************** START STUDENT ******************** */
/* 2 GET Student Login / Register page. */
router.get('/student/login', studentController.student_login);

/* 2 POST Student sign in / Register page. */
router.post('/student/sign-in', studentController.student_sign_in);

/* 2 POST Student sign up / Register page. */
router.post('/student/sign-up', studentController.student_sign_up);

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
