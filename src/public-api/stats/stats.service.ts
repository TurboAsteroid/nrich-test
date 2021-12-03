import { Injectable } from '@nestjs/common';
import { GetStatsDto } from './dto/get-stats.dto';
import { ClickhouseService } from '../../private-api/clickhouse/clickhouse.service';

@Injectable()
export class StatsService {
  constructor() {}

  // eslint-disable-next-line class-methods-use-this
  getStatsByTracker(getStatsDto: GetStatsDto) {
    return ClickhouseService.getStatsByTracker(getStatsDto);
  }
}
