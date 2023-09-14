const CustomAPIError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class AuthenticationError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.code = StatusCodes.UNAUTHORIZED;
    this.type = "UNAUTHORIZED_ERROR"
  }
}

module.exports = AuthenticationError;