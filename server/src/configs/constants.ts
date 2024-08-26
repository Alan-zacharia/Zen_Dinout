export const STATUS_CODES = {
  OK: 200,
  NO_CONTENT: 204,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503,
  BLOCKED : 422
};

export const MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error",
  INVALID_EMAIL_FORMAT: "Invalid email format",
  INVALID_REGISTER: "Please provide all required fields.",
  INVALID_PASSWORD: "Incorrect Password..",
  PASSWORD_REQUIRED: "Password with 8 or more characters required",
  LOGIN_FAILURE: "Invalid email or password",
  PAYMENT_REQUIRED: "Payment required",
  FORBIDDEN_ACCESS: "Forbidden access",
  RESOURCE_NOT_FOUND: "User Not found..",
  DATA_NOT_FOUND: "Data Not found..",
  USER_ALREADY_EXISTS: "A user with this email already exists",
  SOMETHING_WENT_WRONG: "Something went wrong....",
  ADMIN_DOESNOT_EXIST: "Admin does not exists",
  INVALID_DATA: "Please provide all required fields.",
  INVALID_FORMAT: "Invalid format....",
  NO_TABLES_AVAILABLE : "No tables available",
  USER_BLOCKED : "Sorry this user blocked by admin..."
};

export const SUCCESS_MESSAGES = {
  FETCHED_SUCCESSFULLY: "Successfully fetched ......",
  LOGIN_SUCCESS: "Login successful..",
  RESOURCE_CREATED: "Created successfully....",
  REGISTRATION_SUCCESS: "Registeration successful...",
  UPDATED_SUCCESSFULLY: "Updated  succesfully....",
  RESTAURANT_REJECT: "Restaurant rejected successfully ....",
  APPROVED_SUCCESS: "Restaurant approved successfully...",
  REMOVED_SUCCESS: "Removed successfully...",
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
