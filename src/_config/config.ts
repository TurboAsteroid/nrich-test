import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export type TypeEnv = 'production' | 'development' | 'local';

export class Config {
  static environment: TypeEnv | string = process.env.NODE_ENV;

  static production: boolean = process.env.NODE_ENV === 'production';

  static apiPort = process.env.PORT || 3000;

  static postgres: PostgresConnectionOptions = {
    type: 'postgres',
    applicationName: 'nrich',
    host: process.env.PG_HOST,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    ssl: false,
    logging: false,
    synchronize: false,
  };

  static clickHouse = {
    host: process.env.CH_HOST,
    port: parseInt(process.env.CH_PORT, 10) || 8443,
    database: process.env.CH_DB,
    path: ``,
    headers: {
      'X-ClickHouse-User': process.env.CH_USER,
      'X-ClickHouse-Key': process.env.CH_PASSWORD,
    },
  };

  static cacheConfig = {
    ttl: 60,
    max: 1000,
  };

  static appBaseUri = 'http://localhost';

  constructor() {}
}
