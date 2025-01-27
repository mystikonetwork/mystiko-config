import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsEthereumAddress,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ContractType } from '../../common';
import { RawConfig } from '../base';

export class RawContractConfig extends RawConfig {
  @Expose()
  @IsInt()
  @IsPositive()
  public version: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Expose()
  @IsEthereumAddress()
  public address: string;

  @Expose()
  @IsInt()
  @IsPositive()
  @IsOptional()
  public disabledAt?: number = undefined;

  @Expose()
  @IsEnum(ContractType)
  public type: ContractType;

  @Expose()
  @IsInt()
  @IsPositive()
  public startBlock: number;

  @Expose()
  @IsInt()
  @IsPositive()
  @IsOptional()
  public eventFilterSize?: number = undefined;

  @Expose()
  @IsInt()
  @IsPositive()
  @IsOptional()
  public indexerFilterSize?: number = undefined;
}
