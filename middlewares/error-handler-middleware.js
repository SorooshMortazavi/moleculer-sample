const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = function (error, request, reply) {
  if (error) {
    const defaultError = {
      statusCode: error.code || StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || "Something went wrong please try again",
      type: error.type || "INTERNAL_SERVER_ERROR"
    }

    if (error.name === "ValidationError") {
      defaultError.statusCode = StatusCodes.BAD_REQUEST;
      defaultError.type = "ValidationError";
      defaultError.message = error.message;
    }
    reply.status(defaultError.statusCode).send({
      result: null,
      result_message: defaultError
    });
  }
};

module.exports = { errorHandlerMiddleware };
