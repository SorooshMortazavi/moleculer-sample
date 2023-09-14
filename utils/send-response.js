const sendResponse = (reply, data, message) => {
  reply.send({
    result: data,
    state: "success",
    result_message: {
      type: "success",
      title: "Success",
      message: message,
    },
  });
};

module.exports = { sendResponse };
