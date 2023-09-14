require("dotenv").config({ path: "../.env" });

const serializeUserModel =  ({ user }) => {
	return {
		_id: user._id,
		role: user.role,
		password: "",
		gender: user.gender,
		isActive: user.isActive,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		username: user.username,
	};
};

module.exports = {
	serializeUserModel,
};
