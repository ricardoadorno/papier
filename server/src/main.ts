/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./exceptions/http-exception.filter";
import { PrismaExceptionFilter } from "./exceptions/prisma-exception.filter";
import { HttpAdapterHost } from "@nestjs/core";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? "*", // Allow all origins by default
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  // Get the HTTP adapter host to pass to the Prisma exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("Papier API")
    .setDescription("The Papier API documentation")
    .setVersion("1.0")
    .addTag("documents")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove non-whitelisted properties
      transform: true, // Automatically transform payloads
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
    }),
  );

  // Apply exception filters globally
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new PrismaExceptionFilter(httpAdapter),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
