/* eslint-disable prettier/prettier */
declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính không được khai báo trong DTO
      transform: true, // Tự động chuyển đổi dữ liệu đầu vào thành instance của DTO
      forbidNonWhitelisted: true, // Ném lỗi nếu có thuộc tính không khai báo
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation') // Tiêu đề tài liệu API
    .setDescription('API documentation for the application') // Mô tả tài liệu API
    .setVersion('1.0') // Phiên bản tài liệu
    .addBearerAuth() // Thêm xác thực Bearer Token
    .build();

  const document = SwaggerModule.createDocument(app, config); // Tạo tài liệu Swagger
  SwaggerModule.setup('api-docs', app, document); // Đường dẫn đến tài liệu Swagger: /api-docs

  // Start the application
  await app.listen(process.env.PORT ?? 3000);

  // Hot Module Replacement (HMR)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
