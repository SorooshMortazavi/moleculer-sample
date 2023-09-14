"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");

const { User } = require("../models");
const path = require("path");
const CacheCleaner = require("../mixins/cache-clean");
const { sendResponse } = require("../utils");
const { serializeUserModel } = require("../serializers/serialize-user");

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
		findOne: {
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
				let users = await User.find({})
				users = users.map(item => serializeUserModel({user:item}))
				sendResponse(reply,users, "users list.");
			},
		},
	},
};
