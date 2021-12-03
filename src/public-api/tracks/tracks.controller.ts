import { Controller, Get, HttpCode, NotFoundException, ParseUUIDPipe, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { TracksService } from './tracks.service';

@Controller('track')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Get()
  @HttpCode(204)
  async SendTrackToCH(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Query('id', ParseUUIDPipe) trackerId: string,
  ) {
    const tracker = await this.tracksService.sendTrackToCH(trackerId, request, response);
    if (!tracker) {
      throw new NotFoundException('Invalid tracker id');
    }
  }
}
