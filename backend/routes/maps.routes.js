const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const {query} = require('express-validator');

router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }).withMessage('Address is required'),
     authMiddleware.authUser,
      mapController.getCoordinates);

router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }).withMessage('Origin is required'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Destination is required'),
    authMiddleware.authUser,
     mapController.getDistanceAndTime
     );
module.exports = router;

router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }).withMessage('Input is required'),
    authMiddleware.authUser,
    mapController.getAutoCompleteSuggestions
);