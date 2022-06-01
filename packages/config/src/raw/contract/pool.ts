import {Expose} from 'class-transformer';
import {Equals, IsArray, IsEthereumAddress, IsNotEmpty, IsNumberString, IsOptional, IsString,} from 'class-validator';
import {ContractType} from '../../common';
import {RawContractConfig} from './base';

export class RawPoolContractConfig extends RawContractConfig {
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
