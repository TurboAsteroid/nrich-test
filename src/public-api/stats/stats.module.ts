import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { ClickhouseModule } from '../../private-api/clickhouse/clickhouse.module';

@Module({
  imports: [ClickhouseModule],
  providers: [StatsService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
