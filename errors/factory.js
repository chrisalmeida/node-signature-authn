const HTTPStatus = require("http-status-codes");

/**
 * Retrieve unformated error mapping for an http status code.
 *
 * @param {*} statusCode the HTTP status code to be converted (404, 422, etc.)
 */
const txt = (statusCode) => HTTPStatus.getStatusText(statusCode);

/**
 * Convert an http status code into an error
 * which can be matched on by the client.
 *
 * @param {*} status The http status code (404, 500, etc.)
 */
const statusToError = (status) =>
  `ERR_${txt(status)
    .toUpperCase()
    .replace("ERROR", "")
    .replace(" ", "_")
    .trim()}`;

/**
 * A factory for creating a standardized error interface.
 *
 * @param {*} ErrorKlass A base error class to be used for this factory.
 */
const errorFactory = (ErrorKlass) => (status, description) => {
  return class extends ErrorKlass {
    status = status;
    error = statusToError(this.status);
    description = description;
    constructor(description = "") {
      super(description);
      this.description = description || this.description;
    }
  };
};

module.exports = {
  errorFactory,
  statusToError,
};
