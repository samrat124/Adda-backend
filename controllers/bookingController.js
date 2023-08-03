const facilityModel = require('../models/facilityModel');

function calculateClubhousePrice(startHour, endHour) {
  const clubhouseRates = {
    low: 100, // Rs. 100/hour (10am to 4pm)
    high: 500, // Rs. 500/hour (4pm to 10pm)
  };

  const lowRateEndHour = 16; // 4pm
  const highRateStartHour = 16; // 4pm
  const highRateEndHour = 22; // 10pm

  let totalAmount = 0;

  if (startHour < lowRateEndHour) {
    // Calculate amount for hours before 4pm
    const lowRateHours = Math.min(lowRateEndHour, endHour) - startHour;
    totalAmount += lowRateHours * clubhouseRates.low;
  }

  if (endHour > highRateStartHour) {
    // Calculate amount for hours after 4pm
    const highRateHours = Math.max(endHour, highRateStartHour) - highRateStartHour;
    totalAmount += highRateHours * clubhouseRates.high;
  }

  return totalAmount;
}
 


function createBooking(req, res) {
  const { facilityName, date, slot } = req.body;
  const [startHour, endHour] = slot.split('-').map((time) => parseInt(time.split(':')[0]));

  const selectedFacility = facilityModel.getFacilities().find((facility) => facility.name === facilityName);

  if (!selectedFacility) {
    return res.status(400).json({ message: 'Invalid facility' });
  }

  const bookingKey = date + '-' + slot;
  const isSlotAvailable = selectedFacility.bookings.every((booking) => booking.slot !== bookingKey);

  if (isSlotAvailable) {
    const existingBooking = selectedFacility.bookings.find((booking) => booking.date === date && booking.slot === slot);

    if (!existingBooking) {
      let amount = 0;
      if (facilityName === 'Clubhouse') {
        amount = calculateClubhousePrice(startHour, endHour);
      } else if (facilityName === 'Tennis Court') {
        amount = selectedFacility.slots[slot];
      }

      const newBooking = { date, slot, amount };
      selectedFacility.bookings.push(newBooking);

      // Update the data in the db.json file
      const db = facilityModel.readDB();
      const updatedFacilities = db.facilities.map((facility) => {
        if (facility.name === facilityName) {
          return selectedFacility;
        }
        return facility;
      });
      db.facilities = updatedFacilities;
      facilityModel.writeDB(db);

      return res.status(200).json({ message: 'Booked', amount });
    } else {
      return res.status(400).json({ message: 'Booking Failed, Slot already booked for the given date and time' });
    }
  } else {
    return res.status(400).json({ message: 'Booking Failed, Slot already booked for the given date and time' });
  }
}

function updateBooking(req, res) {
  const { facilityName, date, slot, newSlot } = req.body;

  const selectedFacility = facilityModel.getFacilities().find((facility) => facility.name === facilityName);

  if (!selectedFacility) {
    return res.status(400).json({ message: 'Invalid facility' });
  }

  const bookingKey = date + '-' + slot;
  const newBookingKey = date + '-' + newSlot;
  const isSlotAvailable = selectedFacility.bookings.every((booking) => booking.slot !== newBookingKey);

  if (isSlotAvailable) {
    const bookingIndex = selectedFacility.bookings.findIndex((booking) => booking.slot === bookingKey);

    if (bookingIndex !== -1) {
      selectedFacility.bookings[bookingIndex].slot = newBookingKey;
      // Write updated data back to the database file
      const db = facilityModel.readDB();
      db.facilities = facilityModel.getFacilities();
      facilityModel.writeDB(db);
      return res.status(200).json({ message: 'Booking Updated', newSlot });
    } else {
      return res.status(404).json({ message: 'Booking not found' });
    }
  } else {
    return res.status(400).json({ message: 'Update Failed, Slot already booked for the new time' });
  }
}

function cancelBooking(req, res) {
  const { facilityName, date, slot } = req.body;

  const selectedFacility = facilityModel.getFacilities().find((facility) => facility.name === facilityName);

  if (!selectedFacility) {
    return res.status(400).json({ message: 'Invalid facility' });
  }

  const bookingKey = date + '-' + slot;
  const bookingIndex = selectedFacility.bookings.findIndex((booking) => booking.slot === bookingKey);

  if (bookingIndex !== -1) {
    selectedFacility.bookings.splice(bookingIndex, 1);
    // Write updated data back to the database file
    const db = facilityModel.readDB();
    db.facilities = facilityModel.getFacilities();
    facilityModel.writeDB(db);
    return res.status(200).json({ message: 'Booking Cancelled', slot });
  } else {
    return res.status(404).json({ message: 'Booking not found' });
  }
}

module.exports = {
  createBooking,
  updateBooking,
  cancelBooking,
};
