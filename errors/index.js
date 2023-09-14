const CustomAPIError = require("./custom-error");
const BadRequestError = require("./bad-request-error");
const NotFoundError = require("./not-found-error");
const AuthenticationError = require("./authentication-error");

module.exports = {
  BadRequestError,
  NotFoundError,
  AuthenticationError,
  CustomAPIError
}