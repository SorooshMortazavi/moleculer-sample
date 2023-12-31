"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");

const { User } = require("../models");
const path = require("path");
const CacheCleaner = require("../mixins/cache-clean");
const { sendResponse } = require("../utils");
const { serializeUserModel } = require("../serializers/serialize-user");
const crypto = require("crypto");

// Configuration And Settings
require("dotenv").config({ path: path.resolve(".env") });
module.exports = {
	name: "user",
	version: 1,

	// use fastify as server for this service
	server: false,

	mixins: [DbService, CacheCleaner("user")],

	// configurations and settings for this service
	settings: {
		// use fastify as server for this service
		server: false,
	},

	// setup mongoose as adapter for this service
	adapter: new MongooseAdapter(process.env.MONGO_URL),

	// collection:"users",
	// setup model of mongoose
	model: User,

	// private methods
	methods: {},

	// actions that will be provided from this service
	actions: {
		_findOne: {
			cache: true,
			ttl: 300,
			handler: async (ctx) => {
				const { email } = ctx.params;
				return await User.findOne({ email });
			},
		},
		list: {
			cache: false,
			handler: async (ctx) => {
				const { request, reply } = ctx.params;
				let users = await User.find({});
				users = users.map((item) => serializeUserModel({ user: item }));
				sendResponse(reply, users, "users list.");
			},
		},
		createOne: {
			cache: false,
			handler: async (ctx) => {
				const { request, reply } = ctx.params;
				const { email, username } = request.body;
				const refEmailUser = await User.findOne({ email });
				const refUsernameUser = await User.findOne({ username });
				if (email && refEmailUser) {
					throw new BadRequestError("This email is already exists");
				}
				if (username && refUsernameUser) {
					throw new BadRequestError(
						"This username is already exists"
					);
				}
				const user = await User.create({ ...request.body });
				const record = await serializeUserModel({ user });
				sendResponse(reply, record, "User has created");
			},
		},
		deleteAccount: {
			cache: false,
			handler: async function (ctx) {
				const { request, reply } = ctx.params;
				const userId = request.currentUserId;
				const token = request.token;

				const randHex = crypto.randomBytes(32).toString("hex");
				const user = await User.findById(userId);
				user.email = user.email + "-deleted-" + randHex;
				user.username = user.username + "-deleted-" + randHex;
				user.isActive = false;

				// update tokenObj
				await ctx.call("v1.token.findAndUpdateToken", {
					userId:userId,
					loggedIn: false,
					token: token,
				});

				user.save({ validateBeforeSave: false });
				sendResponse(reply, user, "User deleted");
			},
		},
	},
};
