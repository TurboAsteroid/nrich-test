import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { Cache } from 'cache-manager';
import { TrackerEntity } from '../../@models/postgre-enities/tracker/tracker.entity';
import { ClickhouseService } from '../../private-api/clickhouse/clickhouse.service';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(TrackerEntity) private trackerRepository: Repository<TrackerEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private logger = new Logger('Clickhouse');

  async sendTrackToCH(trackerId: string, request: Request, response: Response): Promise<TrackerEntity> {
    const tracker = await this.getTrackerByUid(trackerId);
    if (tracker === undefined) {
      return undefined;
    }

    const userUUID: string = request.cookies?.user_id as string || v4();
    response.cookie('user_id', v4());
    try {
      ClickhouseService.sendDataToCH(request, userUUID, tracker);
    } catch (e) {
      this.logger.error(e);
    }
    return tracker;
  }

  async getTrackerByUid(trackerId: string): Promise<TrackerEntity> {
    const value = await this.cacheManager.get(trackerId);
    if (!value) {
      const trackerFromDB = await this.trackerRepository.findOne({ where: { uuid: trackerId } });
      if (!trackerFromDB) {
        return undefined;
      }
      await this.cacheManager.set(trackerId, trackerFromDB, { ttl: 10 });
      return trackerFromDB;
    }
    return value as TrackerEntity;
  }
}
