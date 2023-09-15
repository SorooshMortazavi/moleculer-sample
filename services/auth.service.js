"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");

const {
	sendResponse,
	generateJwtToken,
	getTokenFromHeaders,
} = require("../utils");

const { BadRequestError } = require("../errors");
const { User, Token } = require("../models");
const { serializeUserModel } = require("../serializers/serialize-user");
const path = require("path");

// Configuration And Settings
require("dotenv").config({ path: path.resolve(".env") });

module.exports = {
	name: "auth",
	version: 1,

	// use fastify as server for this service
	server: false,

	mixins: [DbService],

	// configurations and settings for this service
	settings: {
		// use fastify as server for this service
		server: false,
	},

	// setup mongoose as adapter for this service
	// adapter: new MongooseAdapter(process.env.MONGO_URL, {
	// 	useUnifiedTopology: true,
	// 	keepAlive: true,
	// }),

	// setup model of mongoose
	// model: User,

	// private methods
	methods: {},

	// actions that will be provided from this service
	actions: {
		// Create Service Controller
		login: {
			cache: false,
			handler: async function (ctx) {
				console.log("LOGIN SERVICE");
				const { request, reply } = ctx.params;
				const { email, password } = request.body;
				const user = await ctx.call("v1.user._findOne", { email });
				if (!user) {
					throw new BadRequestError(
						"User not found",
						400,
						"BadRequest"
					);
				}
				if (user && user.role) {
					// check if email is valid
					if (!user) {
						throw new BadRequestError(
							"email not found",
							400,
							"BadRequest"
						);
					}

					const isCorrect = await user.comparePassword(password);
					if (!isCorrect) {
						throw new BadRequestError(
							"password is wrong",
							400,
							"BadRequest"
						);
					}

					const token = await generateJwtToken({
						payload: { userId: user._id, role: user.role },
					});

					// update token
					const tokenObj = await ctx.call(
						"v1.token.findAndUpdateToken",
						{ userId: user._id, loggedIn: true, token: token }
					);

					const userSerializer = await serializeUserModel({ user });
					const response = {
						token: tokenObj.token,
						userId: user._id,
						user: userSerializer,
					};
					sendResponse(reply, response, "User Logged In");
				} else {
					const response = {
						token: null,
						userId: null,
					};
					sendResponse(reply, response, "Logged In failed");
				}
			},
		},

		// Logout
		logout: {
			cache: false,
			handler: async (ctx) => {
				const { request, reply } = ctx.params;
				console.log("bbbbbbbbbbbbbbb",request.currentUserId,request.token)
				// update token state
				const tokenObj = await ctx.call("v1.token.findAndUpdateToken", {
					userId: request.currentUserId,
					loggedIn: false,
					token: request.token,
				});

				const response = { user: null, token: tokenObj.token };
				sendResponse(reply, response, "User Logged Out");
			},
		},
	},
};
