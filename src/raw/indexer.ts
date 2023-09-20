import { Expose } from 'class-transformer';
import { IsInt, IsPositive, IsUrl } from 'class-validator';
import { RawConfig } from './base';

export class RawIndexerConfig extends RawConfig {
  @Expose()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  public url: string;

  @Expose()
  @IsInt()
  @IsPositive()
  public timeoutMs: number = 15000;
}
