class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message = "Something went wrong",
    data: any = null,
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.message = message;

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
