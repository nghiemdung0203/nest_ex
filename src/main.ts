/* eslint-disable prettier/prettier */
declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Loại bỏ tất cả các thuộc tính không được khai báo decorator
    transform: true, //Tự động chuyển đổi dữ liệu đầu vào thành instance của DTO
    forbidNonWhitelisted: true //Ném ra lỗi các thuộc tính không được khai báo
  }))

  await app.listen(process.env.PORT ?? 3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
