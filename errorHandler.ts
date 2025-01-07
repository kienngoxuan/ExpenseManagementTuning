export class AppError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const handleError = (error: Error | AppError) => {
  // Centralized error handling
  console.error("Error occurred:", error.message);

  // Optional: Send to error tracking service
  // Sentry.captureException(error);

  return {
    message: error.message,
    code: error instanceof AppError ? error.code : "UNKNOWN_ERROR",
    details: error instanceof AppError ? error.details : {},
  };
};
