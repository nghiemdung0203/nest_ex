import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { UserExportService } from './export.service';

@Module({
  controllers: [ExportController],
  providers: [UserExportService],
  exports: [UserExportService],
})
export class ExportModule {}