const { AuthenticationMiddleware } = require("../middlewares");

const authRoutes = async function (fastify, options) {
  const { broker } = options;

  fastify.post("/auth/login", (request, reply) => { return broker.call("v1.auth.login", { request, reply }) });
  fastify.route({
    method: ["GET"],
    url: "/auth/logout",
    preHandler: AuthenticationMiddleware,
    handler: (request, reply) => { return broker.call("v1.auth.logout", { request, reply }) }
  })
}

module.exports = { authRoutes };
