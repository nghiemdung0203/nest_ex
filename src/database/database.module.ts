/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forRootAsync({ //Thiết lập cấu hình không đồng bộ cho TypeOrm
        useFactory: (configServce: ConfigService) => ({ // Cung cấp config cho kết nối TypeOrm
            type: 'mysql',
            host: configServce.getOrThrow('MYSQL_HOST'),
            port: configServce.getOrThrow('MYSQL_PORT'),
            database: configServce.getOrThrow('MYSQL_DATABASE'),
            username: configServce.getOrThrow('MYSQL_USERNAME'),
            password: configServce.getOrThrow('MYSQL_PASSWORD'),
            autoLoadEntities: true, // Tự động load các enetities được tạo trong Nestjs
            synchronize: configServce.getOrThrow('MYSQL_SYNCHRONIZE'), //Tự động đồng bộ hóa lược đồ csdl với các model entities
        }),
        inject: [ConfigService], // Cho phép chèn các giá trị MYSQL_HOST, MYSQL_PORT,... vào trong config
    })]
})
export class DatabaseModule {}
