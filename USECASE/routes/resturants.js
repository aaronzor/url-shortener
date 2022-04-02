import express from 'express';
import {
    getResturants,
    getResturant,
    createResturant,
    updateResturant,
    deleteResturant,
    getResturantsInRadius,
    resturantPhotoUpload
} from '../controllers/resturant.js';

import Resturant from '../models/Resturant.js';

const router = express.Router();

import advancedResults from '../../middleware/advancedResults.js';
import { protect, authorize } from '../../middleware/auth.js';

router.route('/radius/:postalCode/:distance').get(getResturantsInRadius);

router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), resturantPhotoUpload);

router
    .route('/')
    .get(advancedResults(Resturant, 'courses'), getResturants)
    .post(protect, authorize('publisher', 'admin'), createResturant);

router
    .route('/:id')
    .get(getResturant)
    .put(protect, authorize('publisher', 'admin'), updateResturant)
    .delete(protect, authorize('publisher', 'admin'), deleteResturant);

export { router as resturantRoutes };
