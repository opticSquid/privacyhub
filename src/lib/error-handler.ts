/**
 * Production-grade error handling and logging
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ErrorLog {
  timestamp: string;
  severity: ErrorSeverity;
  message: string;
  error?: Error;
  context?: Record<string, unknown>;
  userId?: string;
  url?: string;
}

class ErrorHandler {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log error with context
   */
  log(
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      severity,
      message,
      error,
      context
    };

    // Console log in development
    if (this.isDevelopment) {
      console.error(`[${severity.toUpperCase()}] ${message}`, {
        error: error?.message,
        stack: error?.stack,
        context
      });
    } else {
      // In production, you can send to external logging service
      // e.g., Sentry, LogRocket, CloudWatch, etc.
      console.error(JSON.stringify(errorLog));
    }

    // Send to external monitoring service (if configured)
    this.sendToMonitoring(errorLog);
  }

  /**
   * Handle API errors with user-friendly messages
   */
  handleApiError(error: unknown): { message: string; status: number } {
    if (error instanceof Error) {
      // Known error types
      if (error.message.includes('rate limit')) {
        return {
          message: 'Rate limit exceeded. Please try again in a moment.',
          status: 429
        };
      }

      if (error.message.includes('timeout')) {
        return {
          message: 'Request timed out. Please try again.',
          status: 504
        };
      }

      if (error.message.includes('network')) {
        return {
          message: 'Network error. Please check your connection.',
          status: 503
        };
      }

      if (error.message.includes('Firebase') || error.message.includes('Firestore')) {
        this.log('Firebase error encountered', ErrorSeverity.HIGH, error);
        return {
          message: 'Database error. Please try again later.',
          status: 500
        };
      }
    }

    // Default error
    return {
      message: 'An unexpected error occurred. Please try again.',
      status: 500
    };
  }

  /**
   * Send errors to monitoring service
   */
  private sendToMonitoring(errorLog: ErrorLog): void {
    // Implement integration with monitoring service
    // e.g., Sentry.captureException(errorLog.error)

    // For now, just track critical errors
    if (errorLog.severity === ErrorSeverity.CRITICAL) {
      // Could send to webhook, Slack, email, etc.
      if (typeof window === 'undefined') {
        // Server-side only
        console.error('CRITICAL ERROR:', errorLog);
      }
    }
  }

  /**
   * Create safe error message for users
   */
  getSafeErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      // Don't expose internal error details in production
      if (!this.isDevelopment) {
        return 'An error occurred. Please try again.';
      }
      return error.message;
    }
    return 'An unexpected error occurred.';
  }

  /**
   * Retry logic with exponential backoff
   */
  async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          this.log(
            `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`,
            ErrorSeverity.LOW,
            lastError
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    this.log('Max retries exceeded', ErrorSeverity.HIGH, lastError);
    throw lastError;
  }
}

export const errorHandler = new ErrorHandler();

/**
 * Async error wrapper for API routes
 */
export function asyncHandler(
  handler: (req: Request) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      const { message, status } = errorHandler.handleApiError(error);
      errorHandler.log('API route error', ErrorSeverity.HIGH, error instanceof Error ? error : undefined);

      return new Response(
        JSON.stringify({ error: message }),
        {
          status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  };
}
