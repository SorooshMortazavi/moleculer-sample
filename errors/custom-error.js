const { StatusCodes } = require("http-status-codes");
const { MoleculerError } = require("moleculer").Errors;


class CustomAPIError extends MoleculerError {
  constructor(message) {
    super(message);
    this.code = StatusCodes.INTERNAL_SERVER_ERROR;
    this.type = "INTERNAL_SERVER_ERROR"
  }
}

module.exports = CustomAPIError;