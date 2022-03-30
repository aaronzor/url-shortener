/* Middleware that follows the DRY principal; the function basically allows
   the use of async/await functions as middleware, this is useful for any
   functions that make http requests, as when using this middleware
   there is no longer any need to repeatedly place try/catch into every
   controller function used in the API */

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
