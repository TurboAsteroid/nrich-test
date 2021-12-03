import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from './_config';
import { TracksModule } from './public-api/tracks/tracks.module';
import { StatsModule } from './public-api/stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfig,
    }),
    TracksModule,
    StatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
