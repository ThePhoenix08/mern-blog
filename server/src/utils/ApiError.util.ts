const httpStatusCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  GONE: 410,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  VALIDATION: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

const ErrorTypes = {
  BAD_REQUEST: "BadRequestError",
  UNAUTHORIZED: "UnauthorizedError",
  FORBIDDEN: "ForbiddenError",
  NOT_FOUND: "NotFoundError",
  CONFLICT: "ConflictError",
  GONE: "GoneError",
  UNSUPPORTED_MEDIA_TYPE: "UnsupportedMediaTypeError",
  VALIDATION: "ValidationError",
  INTERNAL_SERVER: "InternalServerError",
  SERVICE_UNAVAILABLE: "ServiceUnavailableError",
} as const;

const ErrorMessages = {
  [ErrorTypes.BAD_REQUEST]: "Bad request",
  [ErrorTypes.UNAUTHORIZED]: "Unauthorized",
  [ErrorTypes.FORBIDDEN]: "Forbidden",
  [ErrorTypes.NOT_FOUND]: "Not found",
  [ErrorTypes.CONFLICT]: "Conflict",
  [ErrorTypes.GONE]: "Gone",
  [ErrorTypes.UNSUPPORTED_MEDIA_TYPE]: "Unsupported media type",
  [ErrorTypes.VALIDATION]: "Validation error",
  [ErrorTypes.INTERNAL_SERVER]: "Internal server error",
  [ErrorTypes.SERVICE_UNAVAILABLE]: "Service unavailable",
} as const;

const errors = Object.values(ErrorTypes);
type ErrorType = (typeof errors)[number];

class ApiError extends Error {
  public success: boolean = false;
  public readonly statusCode: number;
  public readonly errorType: ErrorType;
  public readonly errors?: any[];
  public readonly data: any;

  constructor({
    statusCode,
    errorType,
    message,
    errors,
    data,
    stack,
  }: {
    statusCode?: number;
    errorType: ErrorType;
    message?: string;
    errors?: any[];
    data?: any;
    stack?: string;
  }) {
    const resolvedErrorType = errorType || ErrorTypes.INTERNAL_SERVER;
    const resolvedStatusCode =
      statusCode ||
      httpStatusCodes[resolvedErrorType as keyof typeof httpStatusCodes] ||
      httpStatusCodes.INTERNAL_SERVER_ERROR;
    const resolvedMessage =
      message ||
      ErrorMessages[resolvedErrorType as keyof typeof ErrorMessages] ||
      "Something went wrong, an error occurred";

    super(resolvedMessage);

    this.statusCode = resolvedStatusCode;
    this.errorType = resolvedErrorType;
    this.errors = errors;
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /** 400 Bad Request: user input validation failed */
  static badRequest(message?: string, data?: any, errors?: any[]) {
    return new ApiError({
      errorType: ErrorTypes.BAD_REQUEST,
      message,
      errors,
      data,
    });
  }

  /** 401 Unauthorized: authentication failed */
  static unauthorized(message?: string, data?: any, errors?: any[]) {
    return new ApiError({
      errorType: ErrorTypes.UNAUTHORIZED,
      statusCode: httpStatusCodes.UNAUTHORIZED,
      message,
      errors,
      data,
    });
  }

  /** 403 Forbidden: insufficient permissions */
  static forbidden(message?: string, data?: any, errors?: any[]) {
    return new ApiError({
      errorType: ErrorTypes.FORBIDDEN,
      statusCode: httpStatusCodes.FORBIDDEN,
      message,
      errors,
      data,
    });
  }

  /** 404 Not Found: resource not found */
  static notFound(message?: string, data?: any, errors?: any[]) {
    return new ApiError({
      errorType: ErrorTypes.NOT_FOUND,
      statusCode: httpStatusCodes.NOT_FOUND,
      message,
      errors,
      data,
    });
  }

  /** 409 Conflict: resource already exists */
  static conflict(message?: string, data?: any, errors?: any[]) {
    return new ApiError({
      errorType: ErrorTypes.CONFLICT,
      statusCode: httpStatusCodes.CONFLICT,
      message,
      errors,
      data,
    });
  }

  /** 410 Gone: resource has been deleted */
  static gone(message?: string, data?: any, errors?: any[]) {
    return new ApiError({
      errorType: ErrorTypes.GONE,
      statusCode: httpStatusCodes.GONE,
      message,
      errors,
      data,
    });
  }

  /** 415 Unsupported Media Type: unsupported media type */
  static unsupportedMediaType(message?: string, data?: any, errors?: any[]) {
    return new ApiError({
      errorType: ErrorTypes.UNSUPPORTED_MEDIA_TYPE,
      statusCode: httpStatusCodes.UNSUPPORTED_MEDIA_TYPE,
      message,
      errors,
      data,
    });
  }

  /** 422 Validation: user input validation failed */
  static validation(message?: string, data?: any, errors?: any[]) {
    return new ApiError({
      errorType: ErrorTypes.VALIDATION,
      statusCode: httpStatusCodes.VALIDATION,
      message,
      errors,
      data,
    });
  }

  /** 500 Internal Server Error: internal server error */
  static internal(message?: string, data?: any, errors?: any[]) {
    return new ApiError({
      errorType: ErrorTypes.INTERNAL_SERVER,
      statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
      message,
      errors,
      data,
    });
  }

  /** 503 Service Unavailable: service is unavailable at the moment */
  static serviceUnavailable(message?: string, data?: any, errors?: any[]) {
    return new ApiError({
      errorType: ErrorTypes.SERVICE_UNAVAILABLE,
      statusCode: httpStatusCodes.SERVICE_UNAVAILABLE,
      message,
      errors,
      data,
    });
  }
}

export default ApiError;
