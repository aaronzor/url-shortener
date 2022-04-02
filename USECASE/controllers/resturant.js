import ErrorResponse from '../../utils/errorResponse.js';
import asyncHandler from '../../middleware/async.js';
import geocoder from '../../utils/geocoder.js';
import Resturant from '../models/Resturant.js';
import path from 'path';

// @desc      Get all resturants
// @route     GET /api/v1/resturants
// @access    Public
export const getResturants = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc      Get single resturant
// @route     GET /api/v1/resturants/:id
// @access    Public
export const getResturant = asyncHandler(async (req, res, next) => {
    const resturant = await Resturant.findById(req.params.id);

    if (!resturant) {
        return next(
            new ErrorResponse(
                `Resturant not found with id of ${req.params.id}`,
                404
            )
        );
    }

    res.status(200).json({ success: true, data: resturant });
});

// @desc      Create new resturant
// @route     POST /api/v1/resturants
// @access    Private
export const createResturant = asyncHandler(async (req, res, next) => {
    // Add user to req,body
    req.body.user = req.user.id;

    // Check for published resturant
    const publishedResturant = await Resturant.findOne({ user: req.user.id });

    // If the user is not an admin, they can only add one resturant
    if (publishedResturant && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `The user with ID ${req.user.id} has already published a resturant`,
                400
            )
        );
    }

    const resturant = await Resturant.create(req.body);

    res.status(201).json({
        success: true,
        data: resturant
    });
});

// @desc      Update resturant
// @route     PUT /api/v1/resturants/:id
// @access    Private
export const updateResturant = asyncHandler(async (req, res, next) => {
    let resturant = await Resturant.findById(req.params.id);

    if (!resturant) {
        return next(
            new ErrorResponse(
                `Resturant not found with id of ${req.params.id}`,
                404
            )
        );
    }

    // Make sure user is resturant owner
    if (
        resturant.user.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this resturant`,
                401
            )
        );
    }

    resturant = await Resturant.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: resturant });
});

// @desc      Delete resturant
// @route     DELETE /api/v1/resturants/:id
// @access    Private
export const deleteResturant = asyncHandler(async (req, res, next) => {
    const resturant = await Resturant.findById(req.params.id);

    if (!resturant) {
        return next(
            new ErrorResponse(
                `Resturant not found with id of ${req.params.id}`,
                404
            )
        );
    }

    // Make sure user is resturant owner
    if (
        resturant.user.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to delete this resturant`,
                401
            )
        );
    }

    resturant.remove();

    res.status(200).json({ success: true, data: {} });
});

// @desc      Get resturants within a radius
// @route     GET /api/v1/resturants/radius/:postalCode/:distance
// @access    Private
export const getResturantsInRadius = asyncHandler(async (req, res, next) => {
    const { postalCode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(postalCode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const resturants = await Resturant.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: resturants.length,
        data: resturants
    });
});

// @desc      Upload photo for resturant
// @route     PUT /api/v1/resturants/:id/photo
// @access    Private
export const resturantPhotoUpload = asyncHandler(async (req, res, next) => {
    const resturant = await Resturant.findById(req.params.id);

    if (!resturant) {
        return next(
            new ErrorResponse(
                `Resturant not found with id of ${req.params.id}`,
                404
            )
        );
    }

    // Make sure user is resturant owner
    if (
        resturant.user.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this resturant`,
                401
            )
        );
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // Create custom filename
    file.name = `photo_${resturant._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Resturant.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});
