const axios = require('axios');
const captainModel = require('../models/captain.model');
module.exports.getAddressCoordinates = async (address) => {
  
 const api = process.env.GOOGLE_MAPS_API_KEY;
 const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${api}`;
 
 try{
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng
      };
    } else {
      throw new Error("Unable to find address coordinates");
    }
 }catch (error) {
    console.error("Error fetching address coordinates:", error);
    throw error;
 }
}

module.exports.getDistanceAndTime = async (origin, destination) => {
     if(!origin || !destination) {
    throw new Error("Origin and destination are required");
 } 
 const api = process.env.GOOGLE_MAPS_API_KEY;
 const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${api}`;
 
 try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const element = response.data.rows[0].elements[0];
      if (element.status === "OK") {
        return {
          distance: element.distance,
          duration: element.duration,
        };
      } else {
        throw new Error("Unable to find distance and time");
      }
    } else {
      throw new Error("Error fetching distance and time");
    }
 } catch (error) {
    console.error("Error fetching distance and time:", error);
    throw error;
 }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
 const api = process.env.GOOGLE_MAPS_API_KEY;
 const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${api}`;
 
 try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.predictions.map(prediction => ({
        description: prediction.description,
        place_id: prediction.place_id
      }));
    } else {
      throw new Error("Unable to fetch suggestions");
    }
 } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    throw error;
 }
}

module.exports.getCaptainsIntheRadius = async (lat, lng, radiusMeters) => {
  return await captainModel.find({
    status: "active",
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        $maxDistance: radiusMeters // METERS
      }
    }
  });
};





