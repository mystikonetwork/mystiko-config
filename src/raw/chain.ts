import { Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  Contains,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProviderType } from '../common';
import { RawAssetConfig } from './asset';
import { RawConfig } from './base';
import { RawDepositContractConfig, RawPoolContractConfig } from './contract';
import { RawProviderConfig } from './provider';

export const EXPLORER_TX_PLACEHOLDER: string = '%tx%';
export const EXPLORER_DEFAULT_PREFIX: string = `/tx/${EXPLORER_TX_PLACEHOLDER}`;

export class RawChainConfig extends RawConfig {
  @Expose()
  @IsInt()
  @IsPositive()
  public chainId: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public assetSymbol: string;

  @Expose()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  public alliedAssetSymbols: string[] = [];

  @Expose()
  @IsInt()
  @IsPositive()
  public assetDecimals: number = 18;

  @Expose()
  @IsArray()
  @ArrayUnique()
  @IsNumberString({ no_symbols: true }, { each: true })
  public recommendedAmounts: string[] = [];

  @Expose()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  public explorerUrl: string;

  @Expose()
  @Contains(EXPLORER_TX_PLACEHOLDER)
  public explorerPrefix: string = EXPLORER_DEFAULT_PREFIX;

  @Expose()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  public explorerApiUrl: string;

  @Expose()
  @Type(() => RawProviderConfig)
  @ValidateNested()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  public providers: Array<RawProviderConfig> = [];

  @Expose()
  @IsEnum(ProviderType)
  public providerType: ProviderType = ProviderType.FAILOVER;

  @Expose()
  @IsInt()
  @Min(30)
  @Max(100)
  public providerQuorumPercentage: number = 50;

  @Expose()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  public signerEndpoint: string;

  @Expose()
  @IsInt()
  @Min(0)
  public eventDelayBlocks: number = 0;

  @Expose()
  @IsInt()
  @IsPositive()
  public eventFilterSize: number = 200000;

  @Expose()
  @IsInt()
  @IsPositive()
  public indexerFilterSize: number = 500000;

  @Expose()
  @IsInt()
  @IsPositive()
  public sequencerFetchSize: number = 500000;

  @Expose()
  @IsInt()
  @IsPositive()
  @IsOptional()
  public safeConfirmations?: number;

  @Expose()
  @Type(() => RawDepositContractConfig)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((conf) => conf.address)
  public depositContracts: RawDepositContractConfig[] = [];

  @Expose()
  @Type(() => RawPoolContractConfig)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((conf) => conf.address)
  public poolContracts: RawPoolContractConfig[] = [];

  @Expose()
  @Type(() => RawAssetConfig)
  @ValidateNested()
  @IsArray()
  @ArrayUnique((conf) => conf.assetAddress)
  public assets: RawAssetConfig[] = [];

  @Expose()
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  public packerGranularities: number[] = [];
}
