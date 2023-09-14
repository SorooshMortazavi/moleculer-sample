const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../errors");

const { getCurrentUserId } = require("../utils");
const AuthenticationMiddleware2 = (request, replay, next) => {
  console.log(`👉 check provided token`);
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    // search for token in header
    const token = authHeader.split(' ')[1];
    if (token && token !== "null") {
      const { payload } = getCurrentUserId({ token });
      const { userId } = payload;
      request.currentUserId = userId;
	  request.token = token;
      next();
    } else {
      throw new AuthenticationError("Invalid Authentication");
    }
  } else {
    throw new AuthenticationError("Invalid Authentication");
  }
}

const AuthenticationMiddleware = (broker) => {

	return async (request, replay, next) => {


		console.log(`👉 check provided token`);
		const authHeader = request.headers.authorization;
		if (authHeader && authHeader.startsWith('Bearer')) {
		  // search for token in header
		  const token = authHeader.split(' ')[1];
		  if (token && token !== "null") {
			const { payload } = getCurrentUserId({ token });
			const { userId } = payload;
			request.currentUserId = userId;
			request.token = token;
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
