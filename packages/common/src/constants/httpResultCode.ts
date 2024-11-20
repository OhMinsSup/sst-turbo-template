export enum HttpResultCode {
  OK = 1, // 성공
  FAIL = -1, // 실패
  // 인증
  NOT_EXIST_EMAIL = 1001, // 이미 가입된 이메일
  NOT_EXIST_USER = 1002, // 이미 가입된 유저
  ALREADY_EXIST_EMAIL = 1003, // 가입되지 않은 이메일
  ALREADY_EXIST_USER = 1004, // 가입되지 않은 이메일
  INCORRECT_PASSWORD = 1005, // 잘못된 패스워드
  // 권한
  UNAUTHORIZED = 4001, // 권한 없음
  SUSPENDED_ACCOUNT = 4002, // 계정 정지
  // 토큰
  INVALID_TOKEN = 6001, // 유효하지 않은 토큰
  EXPIRED_TOKEN = 6002, // 만료된 토큰
  NOT_EXIST_TOKEN = 6003, // 존재하지 않는 토큰
  ALREADY_USED_REFRESH_TOKEN = 6004, // 리프레시 토큰 사용됨
  // 요청
  INVALID_REQUEST = 7000, // 잘못된 요청
  TOO_MANY_REQUESTS = 7001, // 과도한 요청
}
