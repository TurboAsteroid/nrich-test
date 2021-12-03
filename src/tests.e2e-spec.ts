import { CacheModule, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { TracksService } from './public-api/tracks/tracks.service';
import { TrackerEntity } from './@models/postgre-enities/tracker/tracker.entity';
import { Config } from './_config';
import { TracksModule } from './public-api/tracks/tracks.module';
import { StatsModule } from './public-api/stats/stats.module';
import { StatsService } from './public-api/stats/stats.service';

const wrongUUID = '1a9d0c63-05bf-4d84-ac60-03051dbdb66b';
const trackers = [
  { uuid: '2e00b2bf-f3f6-4c39-a14f-069d848be487', value: 'value-1' },
  { uuid: '8b1e65fc-9a04-449c-9601-c170298f22aa', value: 'value-2' },
  { uuid: '0800cef3-ee30-4413-9b60-a9f47a59f32c', value: 'value-3' },
  { uuid: 'cd1a6097-37e8-49b9-b4fa-2816f7444ee5', value: 'value-4' },
  { uuid: '0a9d0c63-05bf-4d84-ac60-03051dbdb66b', value: 'value-5' },
];
const trackerStatRequest = {
  tracker_id: '01ff16c2-2753-4a86-8413-488476bbc4bc',
  from: '2007-07-21',
  to: '2027-07-21',
};

describe('App', () => {
  let app: INestApplication;
  let tracksService: TracksService;
  let statsService: StatsService;
  let trackerRepository: Repository<TrackerEntity>;
  let httpServer;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...Config.postgres,
          entities: [TrackerEntity],
        }),
        TypeOrmModule.forFeature([TrackerEntity]),
        CacheModule.register(Config.cacheConfig),
        TracksModule,
        StatsModule,
      ],
      providers: [TracksService, StatsService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    httpServer = app.getHttpServer();
    tracksService = module.get<TracksService>(TracksService);
    statsService = module.get<StatsService>(StatsService);
    trackerRepository = module.get('TrackerEntityRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await trackerRepository.save(trackers);
  });
  afterEach(async () => {
    await trackerRepository.delete({});
  });

  it('Services should be defined', () => {
    expect(tracksService).toBeDefined();
    expect(statsService).toBeDefined();
    expect(httpServer).toBeDefined();
    expect(trackerRepository).toBeDefined();
  });

  describe('GET /stats?tracker_id=&from=&to=', () => {
    it('should return 400 status code', async () => {
      await request(httpServer).get('/stats').expect(400);
      await request(httpServer).get('/stats').query({ from: 'wrong' }).expect(400);
    });
    it('should return empty', async () => {
      const { text } = await request(httpServer)
        .get('/stats')
        .query({
          ...trackerStatRequest,
          tracker_id: wrongUUID,
        })
        .expect(200);
      expect(text).toEqual('');
    });
    it('should return records from CH', async () => {
      const { text } = await request(httpServer).get('/stats').query(trackerStatRequest).expect(200);
      expect(text.length).toBeGreaterThan(0);
      expect(text).toEqual(expect.any(String));
    });
  });

  describe('GET tracker by UUID', () => {
    it('should return an tracker entity', async () => {
      const tracker = await tracksService.getTrackerByUid(trackers[1].uuid);
      expect(tracker).toBeDefined();
      expect(tracker).toEqual(
        expect.objectContaining({
          uuid: trackers[1].uuid,
          value: trackers[1].value,
        }),
      );
    });
    it('should return undefined', async () => {
      const tracker = await tracksService.getTrackerByUid(wrongUUID);
      expect(tracker).toBeUndefined();
    });
    it('should return same objects', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(tracksService.getTrackerByUid(trackers[2].uuid));
      }
      const entities = await Promise.all(promises);
      expect(entities).toHaveLength(10);
      entities.forEach((entity) => {
        expect(entity).toEqual(
          expect.objectContaining({
            uuid: trackers[2].uuid,
            value: trackers[2].value,
          }),
        );
      });
    });
  });

  describe('GET /track?id=', () => {
    it('should return 204 status code', async () => {
      await request(httpServer).get('/track').query({ id: trackers[1].uuid }).expect(204);
    });
    it('should return 400 status code', async () => {
      await request(httpServer).get('/track').query({ id: 'wrong' }).expect(400);
      await request(httpServer).get('/track').expect(400);
    });
    it('should return 404 status code', async () => {
      await request(httpServer).get('/track').query({ id: wrongUUID }).expect(404);
    });
  });
});
