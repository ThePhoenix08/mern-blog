class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors?: any[];
  errorType?: string;

  constructor({
    statusCode,
    message = "Something went wrong",
    data = null,
    errorType,
    errors,
    stack,
  }: {
    statusCode: number;
    message?: string;
    data?: any;
    errorType?: string;
    errors?: any[];
    stack?: string;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.message = message;
    this.errorType = errorType;

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
  }
}

export default ApiError;
