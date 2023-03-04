const sendError = (statusCode, error, res) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};

module.exports = sendError;
