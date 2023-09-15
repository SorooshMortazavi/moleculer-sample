const { AuthorizationMiddleware } = require("./authorization-middleware");
const { AuthenticationMiddleware } = require("./authentication-middleware");
const { errorHandlerMiddleware } = require("./error-handler-middleware");
const { notFoundErrorMiddleware } = require("./not-found-middleware");

module.exports = {
	AuthenticationMiddleware,
	notFoundErrorMiddleware,
	errorHandlerMiddleware,
	AuthorizationMiddleware,
};
