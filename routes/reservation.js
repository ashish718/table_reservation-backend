const router = require('express').Router();
const db = require('../config/db.js');
const reservationController = require('../controllers/reservation');


router.get('/outlet/:cityName/:outletName', reservationController.outletFind);

router.post('/otp', reservationController.genOtp);

router.post('/verifyOtp', reservationController.verifyOtp);

router.post('/reserve',  reservationController.reserve);

module.exports = router;
