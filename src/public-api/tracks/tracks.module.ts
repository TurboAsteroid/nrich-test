import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { TrackerEntity } from '../../@models/postgre-enities/tracker/tracker.entity';
import { Config } from '../../_config';

@Module({
  imports: [TypeOrmModule.forFeature([TrackerEntity]), CacheModule.register(Config.cacheConfig)],
  providers: [TracksService],
  controllers: [TracksController],
  exports: [TracksService],
})
export class TracksModule {}
