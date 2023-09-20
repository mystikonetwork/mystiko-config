import { Expose } from 'class-transformer';
import { IsInt, IsPositive, IsUrl, Min } from 'class-validator';
import { RawConfig } from './base';

export class RawProviderConfig extends RawConfig {
  @Expose()
  @IsUrl({ protocols: ['http', 'https', 'ws', 'wss'], require_tld: false })
  public url: string;

  @Expose()
  @IsInt()
  @IsPositive()
  public timeoutMs: number = 5000;

  @Expose()
  @IsInt()
  @IsPositive()
  public maxTryCount: number = 2;

  @Expose()
  @IsInt()
  @Min(1)
  public quorumWeight: number = 1;
}
