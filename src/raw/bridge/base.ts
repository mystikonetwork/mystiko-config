import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BridgeType } from '../../common';
import { RawConfig } from '../base';

export class RawBridgeConfig extends RawConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Expose()
  @IsEnum(BridgeType)
  public type: BridgeType;
}
