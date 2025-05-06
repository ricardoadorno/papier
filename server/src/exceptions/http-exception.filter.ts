import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let error = "Internal Server Error";

    if (exception instanceof HttpException) {
      const httpException = exception as HttpException;
      status = httpException.getStatus();
      const responseBody = httpException.getResponse();

      if (typeof responseBody === "object" && responseBody !== null) {
        message = (responseBody as any).message || message;
        error = (responseBody as any).error || error;
      } else if (typeof responseBody === "string") {
        message = responseBody;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log the exception for debugging purposes
    console.error("Exception:", exception);

    // Return a standardized error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message,
    });
  }
}
