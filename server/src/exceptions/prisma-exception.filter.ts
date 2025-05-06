import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import { Response } from "express";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status: HttpStatus;
    let message: string;

    switch (exception.code) {
      // Handle unique constraint violations
      case "P2002":
        status = HttpStatus.CONFLICT;
        const field = exception.meta?.target as string[];
        message = `Unique constraint violation on ${field?.join(", ")}`;
        break;

      // Handle record not found
      case "P2025":
        status = HttpStatus.NOT_FOUND;
        message = (exception.meta?.cause as string) || "Record not found";
        break;

      // Handle foreign key constraint failures
      case "P2003":
        status = HttpStatus.BAD_REQUEST;
        const constraint = exception.meta?.field_name as string;
        message = `Foreign key constraint failed on ${constraint}`;
        break;

      // Default case for other Prisma errors
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = "Database error occurred";
        console.error(`Unhandled Prisma error: ${exception.code}`, exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
