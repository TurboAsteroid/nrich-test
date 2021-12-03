import { Module } from '@nestjs/common';
import { ClickhouseService } from './clickhouse.service';

@Module({
  imports: [],
  providers: [ClickhouseService],
  controllers: [],
  exports: [ClickhouseService],
})
export class ClickhouseModule {}
