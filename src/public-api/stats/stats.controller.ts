import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { GetStatsDto } from './dto/get-stats.dto';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  async getStats(@Query() getStatsDto: GetStatsDto) {
    return this.statsService.getStatsByTracker(getStatsDto);
  }
}
