const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../errors");
const { getCurrentUserPayload } = require("../utils");

const AuthenticationMiddleware = (broker) => {

	return async (request, replay, next) => {

		const authHeader = request.headers.authorization;
		const token = authHeader.split(' ')[1];

		const tokenCredit = await broker.call('v1.token.checkTokenCredit',{token})

		if (!tokenCredit) {
			throw new AuthenticationError("Token Out Of Date");
		}
		console.log(`👉 check provided token`);
		if (authHeader && authHeader.startsWith('Bearer')) {
		  // search for token in header
		  if (token && token !== "null") {
			const { payload } = getCurrentUserPayload({ token });
			const { userId,role } = payload;
			request.currentUserId = userId;
			request.token = token;
			request.role = role;
			next();
		  } else {
			throw new AuthenticationError("Invalid Authentication");
		  }
		} else {
		  throw new AuthenticationError("Invalid Authentication");
		}
	  }
}

module.exports = { AuthenticationMiddleware };
