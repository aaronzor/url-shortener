import { nanoid } from 'nanoid';
import Url from '../models/Url.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc Create new Short URL
// @route POST api/v1/url/newurl
// @access Public
export const newUrl = asyncHandler(async (req, res, next) => {
  // Deconstruct body
  const { origUrl } = req.body;

  // Declare base url var from env variable
  const base = process.env.BASE_URL;

  // Generate random url string
  const urlId = nanoid(10);

  // Generate actual short url
  const shortUrl = `${base}/${urlId}`;

  // Add url entry to DB
  const newUrl = await Url.create({
    urlId,
    origUrl,
    shortUrl,
  });

  // Response
  res.status(200).json({ success: 'true', newUrl });
});

// @desc Create new Short URL as logged in user
// @route POST api/v1/url/newuserurl
// @access Private
export const newUserUrl = asyncHandler(async (req, res, next) => {
  // Deconstruct body
  const { origUrl } = req.body;

  // Declare base url var from env variable
  const base = process.env.BASE_URL;

  // Find user id
  req.body.user = req.user.id;

  // Generate random url string
  const urlId = nanoid(10);

  // Generate actual short url
  const shortUrl = `${base}/${urlId}`;

  // Add url entry to DB
  const newUrl = await Url.create({
    urlId,
    origUrl,
    shortUrl,
    user: req.body.user,
  });

  // Response
  res.status(200).json({ success: 'true', newUrl });
});

// @desc Redirect route
// @route GET api/v1/url/:urlId
// @access Public
export const redirectUrl = asyncHandler(async (req, res, next) => {
  // URL Variable
  const url = await Url.findOne({ urlId: req.params.urlid });

  // Error Handling
  if (!url) {
    return next(new ErrorResponse('URL Not Found.', 404));
  }

  // Increase clicks and redirect on successful URL
  url.clicks++;
  url.save();
  return res.redirect(url.origUrl);
});

// @desc      Get all URLs
// @route     GET /api/v1/URLs
// @access    Public
export const getUrls = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single URL
// @route     GET /api/v1/url/:id
// @access    Public
export const getUrl = asyncHandler(async (req, res, next) => {
  // Query DB for url
  const url = await Url.findById(req.params.id);

  // Error Handling
  if (!url) {
    return next(
      new ErrorResponse(`URL not found with id of ${req.params.id}`, 404)
    );
  }

  // Response
  res.status(200).json({ success: true, data: url });
});

// @desc      Delete URL
// @route     DELETE /api/v1/url/:id
// @access    Private
export const deleteUrl = asyncHandler(async (req, res, next) => {
  // Query DB for url
  const url = await Url.findById(req.params.id);

  // Error Handling
  if (!url) {
    return next(
      new ErrorResponse(`URL not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is URL owner
  if (url.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this URL`,
        401
      )
    );
  }

  // Delete selected URL
  url.remove();

  // Response
  res.status(200).json({ success: true, data: {} });
});

// @desc      Find all URLs by user
// @route     DELETE /api/v1/url/getuserurl/:id
// @access    Private
export const getUsersUrls = asyncHandler(async (req, res, next) => {
  // Add user id to body
  req.body.user = req.user.id;

  // Find all URLs containing user id
  const urls = await Url.find({ user: req.body.user });

  // Error Handling
  if (!urls) {
    return next(new ErrorResponse('No URLs found', 404));
  }

  if (req.body.user !== req.params.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to make this request`,
        401
      )
    );
  }

  // Response
  res.status(200).json({
    success: true,
    data: urls,
  });
});
