/* This middleware is used to protect certain routes / controller functions
used in the API by authentication via checking for cookies stored in the browser, 
for example, checking if a user is logged in before being able to update their user information,
for checking to see if a user has the role 'admin' before being able to preform administration activities.  */

// Imports
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from './async.js';
import jwt from 'jsonwebtoken';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    // DEV NOTE
    /* This may require debugging, depending on the name of the cookie store in the browser.
    Also this function splits the cookie string to set the auth token, this may also require
    debugging, depending on how the string is made-up. */

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
        // Set token from cookie
    }
    // else if (req.cookies.token) {
    //   token = req.cookies.token;
    // }

    // Make sure token exists
    if (!token) {
        return next(
            new ErrorResponse('Not authorized to access this route', 401)
        );
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return next(
            new ErrorResponse('Not authorized to access this route', 401)
        );
    }
});

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};
