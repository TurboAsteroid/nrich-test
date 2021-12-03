import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { v4 } from 'uuid';
import * as http from 'http';
import * as querystring from 'querystring';
import { DateTime } from 'luxon';
import { GetStatsDto } from '../../public-api/stats/dto/get-stats.dto';
import { Config } from '../../_config';
import { TrackerEntity } from '../../@models/postgre-enities/tracker/tracker.entity';
import { CHRequestTypeEnum } from '../../@models/clickhouse-entities/CH-request-type.enum';

@Injectable()
export class ClickhouseService {
  constructor() {}

  private static prepareInsertQueryToCh(request: Request, userHash: string, tracker: TrackerEntity): string {
    const currentDate = DateTime.utc().toFormat('y-LL-dd hh:mm:ss');
    return `
      INSERT INTO ${Config.clickHouse.database}.tracking_events
      (date, date_time, event_id, tracker_id, ip, user_id, user_agent, url, value)
      VALUES (
        toDate('${currentDate}'),
        toDateTime('${currentDate}'),
        '${v4()}',
        '${tracker.uuid}',
        '${request.ip}',
        '${userHash}',
        '${request.headers['user-agent']}',
        '${request.url}',
        '${tracker.value}'
      )
    `;
  }

  public static sendDataToCH(request: Request, userHash: string, tracker: TrackerEntity) {
    const trackingEventQuery = ClickhouseService.prepareInsertQueryToCh(request, userHash, tracker);
    return ClickhouseService.executeQueryToCH(trackingEventQuery, CHRequestTypeEnum.POST);
  }

  private static prepareCHRequestOption(query: string, method = CHRequestTypeEnum.GET) {
    const requestConfig = Config.clickHouse;
    requestConfig.path = `/?${querystring.stringify({
      database: Config.clickHouse.database,
      query,
    })}`;
    return { ...requestConfig, method };
  }

  private static executeQueryToCH(query: string, method = CHRequestTypeEnum.GET) {
    return new Promise((resolve, reject) => {
      const req = http.request(ClickhouseService.prepareCHRequestOption(query, method), (res) => {
        if (res.statusCode !== 200) {
          reject(res.statusCode);
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('error', (error) => {
          reject(error);
        });
        res.on('close', () => {
          reject();
        });
        res.on('end', () => {
          resolve(rawData);
        });
      });

      req.end();
    });
  }

  public static getStatsByTracker(getStatsDto: GetStatsDto) {
    const query = `
      SELECT *
      FROM ${Config.clickHouse.database}.tracking_events
      WHERE 
        tracker_id = '${getStatsDto.tracker_id}' AND
        date BETWEEN
            toDate('${DateTime.fromISO(getStatsDto.from.toISOString()).toFormat('y-LL-dd')}') AND
            toDate('${DateTime.fromISO(getStatsDto.to.toISOString()).toFormat('y-LL-dd')}')
    `;
    return ClickhouseService.executeQueryToCH(query);
  }
}
