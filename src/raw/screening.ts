import { Expose } from 'class-transformer';
import { IsInt, IsPositive, IsUrl } from 'class-validator';
import { RawConfig } from './base';

export class RawScreeningConfig extends RawConfig {
  @Expose()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  public url: string = 'https://screening.mystiko.network';

  @Expose()
  @IsInt()
  @IsPositive()
  public clientTimeoutMs: number = 20000;

  @Expose()
  @IsInt()
  @IsPositive()
  public version: number = 1;
}
