import { IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetStatsDto {
  @ApiProperty()
  @IsUUID()
  readonly tracker_id: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  readonly from: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  readonly to: Date;
}
