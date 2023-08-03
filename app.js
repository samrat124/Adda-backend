const express = require('express');
const bodyParser = require('body-parser');
const facilityRoutes = require('./routes/facilityRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const app = express();
const cors=require('cors');
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(bodyParser.json());

app.use('/facilities', facilityRoutes);
app.use('/bookings', bookingRoutes);

module.exports = app;
