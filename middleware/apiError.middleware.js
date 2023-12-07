// middleware/apiError.middleware.js

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }

  // 400 Bad Request: 클라이언트가 서버에게 전달한 요청이 잘못된 형식일 때 사용
  // Ex. 요청의 JSON 형식이 잘못되었거나, 필수 필드가 누락되었을 때
  static BadRequest(message) {
    return new ApiError(400, message);
  }

  // 401 Unauthorized: 요청이 인증되지 않았을 때 사용
  // 주로 보안이 필요한 리소스에 접근할 때 인증 토큰이 없거나 잘못되었을 경우에 발생
  // Ex. 사용자가 로그인하지 않고 보호된 리소스에 접근하려 할 때
  static Unauthorized(message) {
    return new ApiError(401, message);
  }

  // 403 Forbidden: 서버가 요청을 이해했지만, 권한 부족으로 인해 거부되었을 때 사용
  // Ex. 사용자가 관리자 전용 기능에 접근하려 할 때
  static Forbidden(message) {
    return new ApiError(403, message);
  }

  // 404 Not Found: 요청한 리소스가 서버에 없음을 나타낼 때 사용
  // Ex. 사용자가 존재하지 않는 페이지나 제품을 요청했을 때
  static NotFound(message) {
    return new ApiError(404, message);
  }

  // 405 Method Not Allowed: 요청된 HTTP 메소드가 해당 리소스에 대해 허용되지 않을 때 사용
  // Ex. API가 GET 요청만을 지원하는데 POST 요청을 받았을 때
  static MethodNotAllowed(message) {
    return new ApiError(405, message);
  }

  // 409 Conflict: 요청이 서버의 현재 상태와 충돌할 때 사용
  // Ex. 동일한 리소스에 대해 동시에 두 개의 변경 요청이 발생했을 때
  static Conflict(message) {
    return new ApiError(409, message);
  }

  // 500 Internal Server Error: 서버가 처리할 수 없는 오류가 발생했을 때 사용
  // Ex. 데이터베이스 오류 또는 서버 코드의 예외 상황
  static InternalError(message) {
    return new ApiError(500, message);
  }

  // 501 Not Implemented: 서버가 요청된 기능을 지원하지 않을 때 사용
  // Ex. 클라이언트가 서버에 구현되지 않은 메소드를 요청했을 때
  static NotImplemented(message) {
    return new ApiError(501, message);
  }

  // 502 Bad Gateway: 게이트웨이나 프록시 서버가 상위 서버로부터 잘못된 응답을 받았을 때 사용
  // Ex. 로드 밸런서가 다운된 백엔드 서버로부터 응답을 받을 때
  static BadGateway(message) {
    return new ApiError(502, message);
  }

  // 503 Service Unavailable: 서버가 일시적으로 요청을 처리할 수 없을 때 사용
  // 보통 서버 유지보수나 과부하 때문에 발생
  // Ex. 서버가 유지보수 중이거나 트래픽 과부하로 인해 일시적으로 사용 불가능할 때
  static ServiceUnavailable(message) {
    return new ApiError(503, message);
  }

  // 504 Gateway Timeout: 게이트웨이나 프록시 서버가 상위 서버로부터 시간 내에 응답을 받지 못했을 때 사용
  // Ex. 서버가 요청을 처리하는 데 너무 오래 걸려 타임아웃이 발생했을 때
  static GatewayTimeout(message) {
    return new ApiError(504, message);
  }
}

module.exports = ApiError;
