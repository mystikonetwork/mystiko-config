import { Expose } from 'class-transformer';
import {
  Equals,
  IsEnum,
  IsEthereumAddress,
  IsInt,
  IsNumberString,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { BridgeType, ContractType } from '../../common';
import { RawContractConfig } from './base';

export class RawDepositContractConfig extends RawContractConfig {
  @Expose()
  @Equals(ContractType.DEPOSIT)
  public type: ContractType = ContractType.DEPOSIT;

  @Expose()
  @IsEnum(BridgeType)
  public bridgeType: BridgeType;

  @Expose()
  @IsEthereumAddress()
  public poolAddress: string;

  @Expose()
  @IsInt()
  @IsPositive()
  @IsOptional()
  public peerChainId?: number = undefined;

  @Expose()
  @IsEthereumAddress()
  @IsOptional()
  public peerContractAddress?: string = undefined;

  @Expose()
  @IsNumberString({ no_symbols: true })
  public minAmount: string = '0';

  @Expose()
  @IsNumberString({ no_symbols: true })
  public maxAmount: string = '0';

  @Expose()
  @IsNumberString({ no_symbols: true })
  public minBridgeFee: string = '0';

  @Expose()
  @IsNumberString({ no_symbols: true })
  public minExecutorFee: string = '0';

  @Expose()
  @IsOptional()
  @IsEthereumAddress()
  public bridgeFeeAssetAddress?: string;

  @Expose()
  @IsOptional()
  @IsEthereumAddress()
  public executorFeeAssetAddress?: string;

  @Expose()
  @IsInt()
  @Min(0)
  public serviceFee: number = 0;

  @Expose()
  @IsInt()
  @IsPositive()
  public serviceFeeDivider: number = 1000000;
}
