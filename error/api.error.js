class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  static BadRequest(message) {
    return new ApiError(400, message);
  }

  static NotFound(message) {
    return new ApiError(404, message);
  }

  static InternalError(message) {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
