const facilityModel = require('../models/facilityModel');

function getFacilities(req, res) {
  const facilities = facilityModel.getFacilities();
  return res.status(200).json(facilities);
}

function getFacilityByName(req, res) {
  const facilityName = req.params.name;
  const facility = facilityModel.getFacilities().find((facility) => facility.name === facilityName);

  if (facility) {
    return res.status(200).json(facility);
  } else {
    return res.status(404).json({ message: 'Facility not found' });
  }
}

module.exports = {
  getFacilities,
  getFacilityByName,
};
