import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Config } from './config';
import { TrackerEntity } from '../@models/postgre-enities/tracker/tracker.entity';

@Injectable()
export class PostgresConfig implements TypeOrmOptionsFactory {
  config = new Config();

  // eslint-disable-next-line class-methods-use-this
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...Config.postgres,
      entities: [TrackerEntity],
    };
  }
}
