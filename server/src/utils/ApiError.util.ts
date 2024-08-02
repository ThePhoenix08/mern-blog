class ApiError extends Error {
  success: boolean;
  errors: any[] | undefined;
  errorType: string;
  data: any;
  statusCode: number;

  CustomErrors: Record<string, number> = {
    AuthenticationError: 401,
    UnauthorizedError: 401,
    UserNotFoundError: 404,
    UserAlreadyExistsError: 409,
    FileUploadError: 500,
    FileDeleteError: 500,
    UnknownError: 500,
    ValidationError: 422,
    DocumentNotFoundError: 404,
    TokenExpiredError: 401,
    InvalidRefreshTokenError: 401,
    AnalyticsError: 500,
  };

  CustomErrorsMessages: Record<string, string> = {
    AuthenticationError: "Authentication error",
    UserNotFoundError: "User not found",
    UserAlreadyExistsError: "User already exists",
    FileUploadError: "Error while uploading file to cloudinary",
    FileDeleteError: "Error while deleting file from cloudinary",
    UnknownError: "Unknown error",
    ValidationError: "Zod validation error",
    DocumentNotFoundError: "Document not found",
    TokenExpiredError: "Token expired",
    InvalidRefreshTokenError: "Invalid refresh token",
    RequestUndefinedError: "Request undefined",
    UnauthorizedRequestError: "Unauthorized request",
    UpdateError: "Error while updating document",
    AnalyticsError: "Error while getting analytics",
  };

  constructor({
    statusCode,
    message = "Something went wrong",
    data = null,
    errorType,
    errors,
    stack,
  }: {
    statusCode?: number;
    message?: string;
    data?: any;
    errorType: string;
    errors?: any[];
    stack?: string;
  }) {
    super(message);
    this.success = false;
    this.errors = errors;
    this.message =
      message || this.CustomErrorsMessages[errorType] || "Something went wrong";
    this.errorType = errorType || "UnknownError";

    // Handle different types of data
    if (data) {
      if (typeof data.format === "function") {
        this.data = data.format();
      } else if (typeof data.toObject === "function") {
        this.data = data.toObject();
      } else {
        this.data = data;
      }
    } else {
      this.data = null;
    }

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    this.statusCode = statusCode || this.CustomErrors[errorType] || 500;
  }
}

export default ApiError;
