import { nanoid } from 'nanoid';
import Url from '../models/Url.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

// Create new short URL

// @desc Create new Short URL
// @route POST api/v1/url/newurl
// @access Public
export const newUrl = asyncHandler(async (req, res, next) => {
  const { origUrl } = req.body;
  const base = process.env.BASE_URL;

  const urlId = nanoid(10);

  const shortUrl = `${base}/${urlId}`;

  const newUrl = await Url.create({
    urlId,
    origUrl,
    shortUrl,
  });

  res.status(200).json({ success: 'true', newUrl });
});

// @desc Create new Short URL
// @route POST api/v1/url/newuserurl
// @access Public
export const newUserUrl = asyncHandler(async (req, res, next) => {
  const { origUrl } = req.body;
  const base = process.env.BASE_URL;
  console.log(req.headers);
  console.log(req.user);

  const urlId = nanoid(10);

  const shortUrl = `${base}/${urlId}`;

  req.body.user = req.user.id;
  const newUrl = await Url.create({
    urlId,
    origUrl,
    shortUrl,
    user: req.body.user,
  });

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

// @desc      Delete URL
// @route     DELETE /api/v1/url/:id
// @access    Private
export const deleteUrl = asyncHandler(async (req, res, next) => {
  const url = await Url.findById(req.params.id);

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

  url.remove();

  res.status(200).json({ success: true, data: {} });
});
