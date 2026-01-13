export enum AppRoutes {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  MY_BOOKINGS = '/my-bookings',
}

export enum ApiEndpoints {
  AUTH_REGISTER = '/auth/register',
  AUTH_LOGIN = '/auth/login',
  ROOMS = '/rooms',
  BOOKINGS = '/bookings',
}

export enum ErrorMessages {
  DEFAULT = 'An unexpected error occurred',
  LOGIN_FAILED = 'Failed to login. Please check your credentials.',
  REGISTER_FAILED = 'Registration failed. Email might already be in use.',
  BOOKING_FAILED = 'Failed to book room. Please try again.',
  FETCH_ROOMS_FAILED = 'Failed to fetch rooms',
  FETCH_BOOKINGS_FAILED = 'Failed to fetch your bookings',
}

export enum SuccessMessages {
  BOOKING_CREATED = 'Your booking has been confirmed!',
}
