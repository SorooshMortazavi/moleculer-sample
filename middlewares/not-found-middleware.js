const notFoundErrorMiddleware = function (request, replay) {
  replay.code(404).send({
    result: null,
    error: {
      status: "failed",
      title: "Not Found",
      message: "not found route url",
      statusCode: 400
    }

  })
}

module.exports = { notFoundErrorMiddleware }