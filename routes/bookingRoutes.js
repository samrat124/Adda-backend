const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/create-booking', bookingController.createBooking);
router.put('/update-booking', bookingController.updateBooking);
router.delete('/cancel-booking', bookingController.cancelBooking);

module.exports = router;
