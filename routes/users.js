const {
	AuthenticationMiddleware,
	AuthorizationMiddleware,
} = require("../middlewares");
const { Roles } = require("../enums");

const usersRoutes = async function (fastify, options) {
	const { broker } = options;

	const authMiddleware = AuthenticationMiddleware(broker);
	fastify.route({
		method: ["DELETE"],
		url: "/user",
		preHandler: [authMiddleware, AuthorizationMiddleware([Roles.USER])],
		handler: (request, reply) => {
			return broker.call("v1.user.deleteAccount", { request, reply });
		},
	});

	fastify.route({
		method: ["GET"],
		url: "/admin/users",
		preHandler: [authMiddleware, AuthorizationMiddleware([Roles.ADMIN])],
		handler: (request, reply) => {
			return broker.call("v1.user.list", { request, reply });
		},
	});

	fastify.route({
		method: ["POST"],
		url: "/admin/user",
		preHandler: [authMiddleware, AuthorizationMiddleware([Roles.ADMIN])],
		handler: (request, reply) => {
			return broker.call("v1.user.createOne", { request, reply });
		},
	});
};

module.exports = { usersRoutes };
