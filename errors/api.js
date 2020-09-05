const HTTPStatus = require("http-status-codes"),
  { statusToError, errorFactory } = require("./factory");

/**
 * API Base class for all API specific errors.
 */
class ApiError extends Error {
  status = HTTPStatus.INTERNAL_SERVER_ERROR;
  error = statusToError(this.status);
  description = "An internal server error ocurred.";
  meta = {};

  constructor(description = "") {
    if (description) {
      super(description);
      this.description = description;
      return;
    } else {
      // Don't overwrite base description.
      super();
    }
  }
}

const errorClass = errorFactory(ApiError);

/**
 * Error class for handling unprocessable
 * request parameters to this API.
 */
const ValidationError = errorClass(
  HTTPStatus.UNPROCESSABLE_ENTITY,
  "The parameters provided failed validation."
);

/**
 * Error class for handling bad
 * request parameters to this API.
 */
const BadRequestError = errorClass(
  HTTPStatus.BAD_REQUEST,
  "This API could not understand the request."
);

/**
 * Error class for handling missing resources within this API.
 */
const NotFoundError = errorClass(
  HTTPStatus.NOT_FOUND,
  "The requested resource is missing."
);

/**
 * Error class for handling unauthorized access to this API.
 */
const UnauthorizedError = errorClass(
  HTTPStatus.UNAUTHORIZED,
  "Please provide a valid email address and password."
);

/**
 * Error class for handling forbidden access to this API.
 */
const ForbiddenError = errorClass(
  HTTPStatus.FORBIDDEN,
  "Application is not allowed to access this resource."
);

/**
 * Error class for handling malformed api signature.
 */
const BadSignatureError = errorClass(
  HTTPStatus.UNAUTHORIZED,
  "The signature provided was invalid."
);

module.exports = {
  ApiError,
  ValidationError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  BadSignatureError,
};
