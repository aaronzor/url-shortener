import express from 'express';
import {
    getResturants,
    getResturant,
    createResturant,
    updateResturant,
    deleteResturant,
    getResturantsInRadius,
    resturantPhotoUpload
} from '../controllers/restaurant.js';

// Import model
import Restaurant from '../models/Restaurant.js';

// Import review router as resource
import { reviewRoutes } from './reviews.js';

const router = express.Router();

// Import middleware
import advancedResults from '../../middleware/advancedResults.js';
import { protect, authorize } from '../../middleware/auth.js';

// Re-route into other router for reviews integration by restaurant
router.use('/:resturantId/reviews', reviewRoutes);

router.route('/radius/:postalCode/:distance').get(getResturantsInRadius);

router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), resturantPhotoUpload);

router
    .route('/')
    .get(advancedResults(Restaurant, 'courses'), getResturants)
    .post(protect, authorize('publisher', 'admin'), createResturant);

router
    .route('/:id')
    .get(getResturant)
    .put(protect, authorize('publisher', 'admin'), updateResturant)
    .delete(protect, authorize('publisher', 'admin'), deleteResturant);

export { router as resturantRoutes };
