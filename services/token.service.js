"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");

const { Token } = require("../models");
const path = require("path");
const CacheCleaner = require("../mixins/cache-clean");


// Configuration And Settings
require("dotenv").config({ path: path.resolve(".env") });
``

module.exports = {
	name: "token",
	version: 1,

	// use fastify as server for this service
	server: false,

	mixins: [DbService,CacheCleaner("token")],

	// configurations and settings for this service
	settings: {
		// use fastify as server for this service
		server: false,
	},

	// setup mongoose as adapter for this service
	adapter: new MongooseAdapter(process.env.MONGO_URL),

	// collection:"tokens",
	// setup model of mongoose
	model: Token,

	// private methods
	methods: {},

	// actions that will be provided from this service
	actions: {
		findAndUpdateToken: {
			cache: false,
			handler: async (ctx) => {
				const { userId, token, loggedIn } = ctx.params;
				return await Token.findOneAndUpdate(
					{ userId: userId},
					{ loggedIn: loggedIn, token: token},
					{ upsert:true,new:true }
				);
			},
		},
		checkTokenCredit: {
			cache:true,
			ttl:3,
			handler: async (ctx) => {
				const {token} = ctx.params;
				const result = await Token.findOne({
					loggedIn:true,
					token:token
				})
				if (result) return true;
				return false;
			}
		}

	},
};
