export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
};

export const MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error",
  INVALID_EMAIL_FORMAT: "Invalid email format",
  INVALID_REGISTER: "Please provide all required fields.",
  INVALID_PASSWORD: "Incorrect Password..",
  PASSWORD_REQUIRED: "Password with 8 or more characters required",
  LOGIN_SUCCESS: "Login successful..",
  LOGIN_FAILURE: "Invalid email or password",
  RESOURCE_CREATED: "Created successfully....",
  PAYMENT_REQUIRED: "Payment required",
  FORBIDDEN_ACCESS: "Forbidden access",
  RESOURCE_NOT_FOUND: "Not found..",
  REGISTRATION_SUCCESS: "Registeration successful...",
  USER_ALREADY_EXISTS: "A user with this email already exists",
  SOMETHING_WENT_WRONG : "Something went wrong...."
};

export const JWT_CONSTANTS = {
  ACCESS_TOKEN_EXPIRES_IN: "1h",
  REFRESH_TOKEN_EXPIRES_IN: "7d",
};

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  SELLER: "seller",
};
