const BadRequestError = require('./bad-request.js')
const CustomAPIError = require('./custom-api');
const NotFoundError = require('./not-found.js')
const UnauthenticatedError = require('./unauthenticated.js')
const UnauthorizedError = require('./unauthorized');
module.exports = { 
  UnauthorizedError,
  CustomAPIError,
  BadRequestError, 
  NotFoundError, 
  UnauthenticatedError 
}
