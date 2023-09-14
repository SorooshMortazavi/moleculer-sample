const { AuthenticationMiddleware } = require("../middlewares")


const usersRoutes = async function (fastify, options) {
	const { broker } = options;

	const authMiddleware =  await AuthenticationMiddleware(broker)
	// lock all routes of this service
	fastify.addHook("preHandler",authMiddleware);
	// routes
	fastify.get("/users", (request, reply) => {
		return broker.call("v1.user.list", { request, reply })
	});














	// fastify.post("/users", (request, reply) => {
	// 	return broker.call("v1.users.createOne", { request, reply })
	// });
	// fastify.get("/users/popular-users", (request, reply) => {
	// 	return broker.call("v1.users.getPopularUsers", { request, reply })
	// });
	// fastify.post("/users/export", (request, reply) => {
	// 	return broker.call("v1.users.exportToExcel", { request, reply })
	// });
	// fastify.get("/users/:userId", (request, reply) => {
	// 	return broker.call("v1.users.findById", { request, reply })
	// });
	// fastify.get("/users/:userId/friends", (request, reply) => {
	// 	return broker.call("v1.users.getFriendsByUserId", { request, reply })
	// });
	// fastify.get("/users/:userId/offers", (request, reply) => {
	// 	return broker.call("v1.users.getOffersByUserId", { request, reply })
	// });
	// fastify.get("/users/:userId/favorite-offers", (request, reply) => {
	// 	return broker.call("v1.users.getFavoriteOffersByUserId", { request, reply })
	// });
	// fastify.get("/users/:userId/comments", (request, reply) => {
	// 	return broker.call("v1.users.getCommentsByUserId", { request, reply })
	// });
	// fastify.get("/users/:userId/interests", (request, reply) => {
	// 	return broker.call("v1.users.getInterestsByUserId", { request, reply })
	// });
	// fastify.delete("/users/:userId", (request, reply) => {
	// 	return broker.call("v1.users.deleteAccount", { request, reply })
	// });
	// fastify.put("/users/update-username/:userId", (request, reply) => {
	// 	return broker.call("v1.users.updateUsername", { request, reply })
	// });
	// fastify.put("/users/update-password/:userId", (request, reply) => {
	// 	return broker.call("v1.users.updatePassword", { request, reply })
	// });
	// fastify.put("/users/:userId", (request, reply) => {
	// 	return broker.call("v1.users.updateOne", { request, reply })
	// });
	// fastify.get("/users/state", (request, reply) => {
	// 	return broker.call("v1.users.getState", { request, reply })
	// });

	// fastify.get("/users/search", (request, reply) => {
	// 	return broker.call("v1.users.search", { request, reply })
	// });
	// // upload photo
	// fastify.route({
	// 	method: ["POST"],
	// 	url: "/users/upload-image/:userId",
	// 	preHandler: upload.single("photo"),
	// 	handler: (request, reply) => {
	// 		return broker.call("v1.users.uploadImage", { request, reply })
	// 	}
	// });
}

module.exports = { usersRoutes };
