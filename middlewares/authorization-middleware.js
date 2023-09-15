const { AuthenticationError } = require("../errors");

const AuthorizationMiddleware = (validRoles) => {
	return async (request, replay, next) => {
		const userRole = request.role;
		if (!userRole) {
			throw new AuthenticationError("Invalid User Role");
		}

		if (!validRoles.includes(userRole)) {
			throw new AuthenticationError("Invalid Authorization");
		}
	};
};

module.exports = {AuthorizationMiddleware}
