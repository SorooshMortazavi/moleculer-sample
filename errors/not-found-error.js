const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");


class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.code = StatusCodes.NOT_FOUND;
    this.type = "NOT_FOUND_ERROR"
  }
}


module.exports = NotFoundError;