import { Expose } from 'class-transformer';
import {
  Equals,
  IsArray,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { BridgeType, ContractType } from '../../common';
import { RawContractConfig } from './base';

export class RawPoolContractConfig extends RawContractConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public poolName: string;

  @Expose()
  @IsEnum(BridgeType)
  public bridgeType: BridgeType;

  @Expose()
  @Equals(ContractType.POOL)
  public type: ContractType = ContractType.POOL;

  @Expose()
  @IsOptional()
  @IsEthereumAddress()
  public assetAddress?: string;

  @Expose()
  @IsNumberString({ no_symbols: true })
  public minRollupFee: string = '0';

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  public circuits: string[] = [];
}
