/**
 * Global Timeout Interceptor
 *
 * Ensures every HTTP request completes within a configurable time limit.
 * Prevents requests from hanging indefinitely due to slow queries, deadlocks,
 * or external service failures.
 *
 * Default: 30 seconds (configurable via REQUEST_TIMEOUT_MS env var)
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

const REQUEST_TIMEOUT_MS = parseInt(process.env.REQUEST_TIMEOUT_MS || '30000', 10);

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimeoutInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request?.method || 'UNKNOWN';
    const url = request?.url || 'unknown';

    return next.handle().pipe(
      timeout(REQUEST_TIMEOUT_MS),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          this.logger.error(
            `Request timeout after ${REQUEST_TIMEOUT_MS}ms: ${method} ${url}`,
          );
          return throwError(() => new RequestTimeoutException(
            `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`,
          ));
        }
        return throwError(() => err);
      }),
    );
  }
}
