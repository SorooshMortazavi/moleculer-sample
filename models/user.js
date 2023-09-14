const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { Roles } = require("../enums");

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "Please Provide your first name"],
			minlength: 2,
			trim: true,
		},
		lastName: {
			type: String,
			required: [true, "Please Provide your last name"],
			minlength: 2,
			trim: true,
		},
		email: {
			type: String,
			validate: {
				validator: validator.isEmail,
				message: "Please provide a valid email address",
			},
			unique: [true, "This email is in use, Please try another one"],
			required: [true, "Please provide the email"],
		},
		password: {
			type: String,
			required: [true, "Please provide the password"],
			minlength: 3,
		},
		role: {
			type: String,
			enum: {
				values: Object.values(Roles),
				message: "{VALUE} is not supported",
			},
			default: Roles.USER,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		username: {
			type: String,
			unique: [true, "username must be unique."],
			required: [true, "username is required."],
			minlength: 2,
			trim: true,
			lowercase: true,
			validate: {
				validator: function (v) {
					return !/^.+\s.+$/g.test(v);
				},
				message: "Username could not contain any spaces.",
			},
		},
	},
	{ timestamps: true }
);

// encrypt password before save user to database.
UserSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// compare entered password with hashed password.
UserSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
