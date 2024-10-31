import { Expose, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsOptional, IsSemVer, ValidateNested } from 'class-validator';
import { BridgeType } from '../common';
import { RawConfig } from './base';
import {
  RawAxelarBridgeConfig,
  RawBridgeConfig,
  RawCelerBridgeConfig,
  RawLayerZeroBridgeConfig,
  RawPolyBridgeConfig,
  RawTBridgeConfig,
  RawWormholeBridgeConfig,
} from './bridge';
import { RawChainConfig } from './chain';
import { RawCircuitConfig } from './circuit';
import { RawIndexerConfig } from './indexer';
import { RawPackerConfig } from './packer';
import { RawSequencerConfig } from './sequencer';
import { RawScreeningConfig } from './screening';

export type RawBridgeConfigType =
  | RawAxelarBridgeConfig
  | RawCelerBridgeConfig
  | RawLayerZeroBridgeConfig
  | RawPolyBridgeConfig
  | RawTBridgeConfig
  | RawWormholeBridgeConfig;

export class RawMystikoConfig extends RawConfig {
  @Expose()
  @IsSemVer()
  public version: string = '0.1.0';

  @Expose()
  public gitRevision?: string = undefined;

  @Expose()
  @Type(() => RawChainConfig)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((conf) => conf.chainId)
  public chains: RawChainConfig[] = [];

  @Expose()
  @ValidateNested()
  @IsArray()
  @ArrayUnique((conf) => conf.type)
  @Type(() => RawBridgeConfig, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: RawAxelarBridgeConfig, name: BridgeType.AXELAR },
        { value: RawCelerBridgeConfig, name: BridgeType.CELER },
        { value: RawLayerZeroBridgeConfig, name: BridgeType.LAYER_ZERO },
        { value: RawPolyBridgeConfig, name: BridgeType.POLY },
        { value: RawTBridgeConfig, name: BridgeType.TBRIDGE },
        { value: RawWormholeBridgeConfig, name: BridgeType.WORMHOLE },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  public bridges: Array<RawBridgeConfigType> = [];

  @Expose()
  @Type(() => RawCircuitConfig)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((conf) => conf.name)
  public circuits: RawCircuitConfig[] = [];

  @Expose()
  @Type(() => RawIndexerConfig)
  @IsOptional()
  @ValidateNested()
  public indexer?: RawIndexerConfig = undefined;

  @Expose()
  @Type(() => RawSequencerConfig)
  @IsOptional()
  @ValidateNested()
  public sequencer?: RawSequencerConfig = undefined;

  @Expose()
  @Type(() => RawPackerConfig)
  @IsOptional()
  @ValidateNested()
  public packer?: RawPackerConfig = undefined;

  @Expose()
  @Type(() => RawPackerConfig)
  @IsOptional()
  @ValidateNested()
  public screening?: RawScreeningConfig;

  @Expose()
  @IsArray()
  @ArrayUnique()
  public countryBlacklist: string[] = [];
}
