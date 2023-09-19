import { Expose } from 'class-transformer';
import { IsUrl, IsInt, IsOptional, IsPositive } from 'class-validator';
import { RawConfig } from './base';

export class RawSequencerConfig extends RawConfig {
  @Expose()
  @IsUrl({ require_tld: false, require_protocol: false })
  public host: string;

  @Expose()
  @IsInt()
  @IsPositive()
  @IsOptional()
  public port?: number;

  @Expose()
  @IsOptional()
  public isSsl?: boolean;
}
