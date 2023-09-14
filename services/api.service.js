"use strict";

const ApiGateway = require("moleculer-web");
const path = require("path");
const {
	notFoundErrorMiddleware,
	errorHandlerMiddleware,
} = require("../middlewares");

// Configuration And Settings
require("dotenv").config({ path: path.resolve(".env") });

const { authRoutes, usersRoutes } = require("../routes");

module.exports = {
	name: "api",
	version:1,
	mixins: [ApiGateway],
	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 3000,

		// use fastify as server
		server: false,

		// Exposed IP
		ip: process.env.IP || "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,
	},

	methods: {
		initRoutes(app) {
			app.get("/check-health", this.checkHealth);
			app.register(usersRoutes, { broker: this.broker, prefix: "/api" });
			app.register(authRoutes, { broker: this.broker, prefix: "/api" });
		},

		async checkHealth(request, replay) {
			try {
				replay.send({ STATE: "api is healthy... 😉" });
			} catch (error) {
				replay.send({ error: `😢 ${error}` });
			}
		},
	},

	async created() {
		this.fastify = require("fastify")({
			caseSensitive: false,
			trustProxy: true,
			logger: true,
		});
		this.ip = process.env.IP;
		this.port = process.env.PORT;

		// Errors Middlewares
		this.fastify.setErrorHandler(errorHandlerMiddleware);
		this.fastify.setNotFoundHandler(notFoundErrorMiddleware);
		// cors
		this.fastify.register(
			require("@fastify/cors", {
				origin: "*",
				methods: "GET,PUT,POST,PATCH,DELETE",
				preflight: true,
			})
		);

		// Serve Static files
		this.fastify.register(require("@fastify/static"), {
			root: path.join(__dirname, "../public"),
			prefix: "/public/",
		});

		// URL Data
		this.fastify.register(require("@fastify/url-data"));

		this.initRoutes(this.fastify);
	},

	async started() {
		const dns = require("dns");

		// Set default result order for DNS resolution
		dns.setDefaultResultOrder("ipv4first");

		const app = this.fastify;
		console.log({ port: process.env.PORT, host: this.settings.ip });
		try {
			app.listen(
				{
					port: process.env.PORT,
					 host: process.env.IP
				},
				(err, address) => {
					app.log.info(`👍 server is listening on ${address}`);
				}
			);
		} catch (error) {
			app.log.error(error);
		}
	},
};
