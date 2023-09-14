const fastify = require('fastify')();

fastify.listen({
	port:5001
})

fastify.get("/",(request,reply) => {
	reply.send("hello i'm here.")
})
