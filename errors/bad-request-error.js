const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.code = StatusCodes.BAD_REQUEST;
    this.type = "BAD_REQUEST_ERROR"
  }
}

module.exports = BadRequestError;