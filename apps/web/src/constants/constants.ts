export const API_ENDPOINTS = {};

export const ASSET_URL = {};

export const PAGE_ENDPOINTS = {
  ROOT: '/',
} as const;

export const SITE_CONFIG = {
  title: 'Template',
  description: 'Template',
  ogImage: undefined,
  favicon: '/favicon.ico',
  logo: '/icons/icon.png',
  apple57x57: undefined,
  apple180x180: undefined,
  apple256x256: undefined,
  manifest: '/manifest.json',
  github: 'https://github.com/OhMinsSup/nouvelles-app',
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'Turborepo'],
};

export const CORS_WHITELIST = {
  ORIGIN: [],
};

export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOED: 405,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,

  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
} as const;

export const RESULT_CODE = {
  // 성공
  OK: 1,
  // 실패
  FAIL: 0,
  // 잘못된 패스워드
  INCORRECT_PASSWORD: 4004,
  // 존재하지 않음
  NOT_EXIST: 2001,
  // 삭제됨
  DELETED: 2002,
  // 이미 존재함
  ALREADY_EXIST: 2003,
  // 유효하지 않음
  INVALID: 2004,
  // 만료된 토큰
  TOKEN_EXPIRED: 4001,
  // 로그인 할 수 없음
  CANNOT_BE_LOGIN: 5000,
  // 로그인이 필요함
  LOGIN_REQUIRED: 5001,
} as const;

export const URL_STATE_KEY = {};

export const MODAL_TYPE = {};

export const SHEET_TYPE = {};
