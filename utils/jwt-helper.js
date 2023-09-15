const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../errors");

const generateJwtToken = async ({ payload }) => {
  console.log({ payload });
  const token = await jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFE_TIME
  });
  return token;
}


const getTokenFromHeaders = async (request) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new AuthenticationError('Authentication invalid')
  }
  return authHeader.split(' ')[1];
}

// check provided token if it is a valid or not
const getCurrentUserPayload = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  generateJwtToken,
  getTokenFromHeaders,
  getCurrentUserPayload
}
