export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorMessages {
  UNAUTHORIZED = 'Unauthorized access',
  FORBIDDEN = 'Permission denied',
  NOT_FOUND = 'Resource not found',
  INTERNAL_SERVER_ERROR = 'An unexpected error occurred',
  INVALID_INPUT = 'Invalid input provided',
  ROOM_NOT_AVAILABLE = 'Room is not available for the selected dates',
  USER_EXISTS = 'User with this email already exists',
  INVALID_CREDENTIALS = 'Invalid email or password',
}

export enum SuccessMessages {
  REGISTER_SUCCESS = 'User registered successfully',
  LOGIN_SUCCESS = 'Login successful',
  BOOKING_SUCCESS = 'Booking created successfully',
  ROOM_CREATED = 'Room created successfully',
}

export enum ApiRoutes {
  AUTH = '/api/v1/auth',
  ROOMS = '/api/v1/rooms',
  BOOKINGS = '/api/v1/bookings',
}
