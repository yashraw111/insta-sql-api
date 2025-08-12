const axios = require('axios');
const db = require('../config/db');

exports.getUserRegisterLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT latitude, longitude FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { latitude, longitude } = rows[0];

    const apiKey = 'd574691caf434ec4b6ed9f72634b613e'; 
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    const { data } = await axios.get(url);

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const formatted = data.results[0].formatted;
    
    const components = data.results[0].components;

    res.status(200).json({
      message: 'Location fetched successfully',
      latitude,
      longitude,
      location: formatted,
      city: components.county || components.town || components.village || '',
      state: components.state || '',
      country: components.country || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.findNearbyUsersLive = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and Longitude are required" });
  }

  try {
    const [nearbyRows] = await db.query(
      `
      SELECT
        u.id,
        u.email,
        u.latitude,
        u.longitude,
        (
          6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(u.latitude)) * COS(RADIANS(u.longitude) 
            - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(u.latitude))
          )
        ) AS distance_km
      FROM users u
      HAVING distance_km <= 150
      ORDER BY distance_km ASC
      `,
      [lat, lng, lat]
    );

    res.status(200).json({
      message: `Users within 15km of your location`,
      nearbyUsers: nearbyRows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};


