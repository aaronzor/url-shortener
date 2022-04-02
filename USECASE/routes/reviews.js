import express from 'express';
import {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} from '../controllers/reviews.js';

import Review from '../models/Review.js';

const router = express.Router({ mergeParams: true });

import advancedResults from '../../middleware/advancedResults.js';
import { protect, authorize } from '../../middleware/auth.js';

router
    .route('/')
    .get(
        advancedResults(Review, {
            path: 'resturant',
            select: 'name description'
        }),
        getReviews
    )
    .post(protect, authorize('user', 'admin'), addReview);

router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview);

export { router as reviewRoutes };
