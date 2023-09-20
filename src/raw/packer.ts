import { Expose } from 'class-transformer';
import { IsEnum, IsInt, IsPositive, IsUrl } from 'class-validator';
import { PackerChecksum, PackerCompression } from '../common';
import { RawConfig } from './base';

export class RawPackerConfig extends RawConfig {
  @Expose()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  public url: string;

  @Expose()
  @IsInt()
  @IsPositive()
  public clientTimeoutMs: number = 15000;

  @Expose()
  @IsInt()
  @IsPositive()
  public version: number = 1;

  @Expose()
  @IsEnum(PackerChecksum)
  public checksum: PackerChecksum = PackerChecksum.SHA512;

  @Expose()
  @IsEnum(PackerCompression)
  public compression: PackerCompression = PackerCompression.ZSTD;
}
