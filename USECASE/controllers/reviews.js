import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';

// @desc      Get reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/restaurants/:resturantId/reviews
// @access    Public
export const getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.resturantId) {
        const reviews = await Review.find({
            restaurant: req.params.resturantId
        });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
export const getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'restaurant',
        select: 'name description'
    });

    if (!review) {
        return next(
            new ErrorResponse(
                `No review found with the id of ${req.params.id}`,
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc      Add review
// @route     POST /api/v1/restaurants/:resturantId/reviews
// @access    Private
export const addReview = asyncHandler(async (req, res, next) => {
    req.body.restaurant = req.params.resturantId;
    req.body.user = req.user.id;

    const restaurant = await Restaurant.findById(req.params.resturantId);

    if (!restaurant) {
        return next(
            new ErrorResponse(
                `No restaurant with the id of ${req.params.resturantId}`,
                404
            )
        );
    }

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    });
});

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
export const updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(
            new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
        );
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review`, 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
export const deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(
            new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
        );
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review`, 401));
    }

    await review.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
