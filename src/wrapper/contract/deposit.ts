import { check, fromDecimals, toBN } from '@mystikonetwork/utils';
import BN from 'bn.js';
import { AssetType, BridgeType } from '../../common';
import { RawDepositContractConfig } from '../../raw';
import { AssetConfig, MAIN_ASSET_ADDRESS } from '../asset';
import { CircuitConfig } from '../circuit';
import { ContractConfig } from './base';
import { PoolContractConfig } from './pool';

type AuxData = {
  poolContractGetter: (address: string) => PoolContractConfig | undefined;
  depositContractGetter: (chainId: number, address: string) => DepositContractConfig | undefined;
  mainAssetConfig: AssetConfig;
  assetConfigs: Map<string, AssetConfig>;
};

export class DepositContractConfig extends ContractConfig<RawDepositContractConfig, AuxData> {
  private readonly bridgeFeeAssetConfig?: AssetConfig;

  private readonly executorFeeAssetConfig?: AssetConfig;

  constructor(data: RawDepositContractConfig, auxData?: AuxData) {
    super(data, auxData);
    this.bridgeFeeAssetConfig = this.initBridgeFeeAssetConfig(this.auxDataNotEmpty.assetConfigs);
    this.executorFeeAssetConfig = this.initExecutorFeeAssetConfig(this.auxDataNotEmpty.assetConfigs);
    this.validate();
  }

  public get bridgeType(): BridgeType {
    return this.data.bridgeType;
  }

  public get poolAddress(): string {
    return this.data.poolAddress;
  }

  public get poolContract(): PoolContractConfig {
    const poolContractConfig = this.auxDataNotEmpty.poolContractGetter(this.poolAddress);
    if (poolContractConfig) {
      return poolContractConfig;
    }
    throw new Error(`no poolContract definition found for deposit contract=${this.address}`);
  }

  public get minAmount(): BN {
    return toBN(this.data.minAmount);
  }

  public get minAmountNumber(): number {
    return fromDecimals(this.data.minAmount, this.assetDecimals);
  }

  public get maxAmount(): BN {
    return toBN(this.data.maxAmount);
  }

  public get maxAmountNumber(): number {
    return fromDecimals(this.data.maxAmount, this.assetDecimals);
  }

  public get minBridgeFee(): BN {
    return toBN(this.data.minBridgeFee);
  }

  public get minBridgeFeeNumber(): number {
    return fromDecimals(this.minBridgeFee, this.bridgeFeeAsset.assetDecimals);
  }

  public get minExecutorFee(): BN {
    return toBN(this.data.minExecutorFee);
  }

  public get minExecutorFeeNumber(): number {
    return fromDecimals(this.minExecutorFee, this.executorFeeAsset.assetDecimals);
  }

  public get asset(): AssetConfig {
    return this.poolContract.asset;
  }

  public get assetType(): AssetType {
    return this.poolContract.assetType;
  }

  public get assetSymbol(): string {
    return this.poolContract.assetSymbol;
  }

  public get assetDecimals(): number {
    return this.poolContract.assetDecimals;
  }

  public get assetAddress(): string | undefined {
    return this.poolContract.assetAddress;
  }

  public get recommendedAmounts(): BN[] {
    return this.poolContract.recommendedAmounts;
  }

  public get recommendedAmountsNumber(): number[] {
    return this.poolContract.recommendedAmountsNumber;
  }

  public get minRollupFee(): BN {
    if (this.peerContract) {
      return this.peerContract.poolContract.minRollupFee;
    }
    return this.poolContract.minRollupFee;
  }

  public get minRollupFeeNumber(): number {
    if (this.peerContract) {
      return this.peerContract.poolContract.minRollupFeeNumber;
    }
    return this.poolContract.minRollupFeeNumber;
  }

  public get circuits(): CircuitConfig[] {
    return this.poolContract.circuits;
  }

  public get peerChainId(): number | undefined {
    return this.data.peerChainId;
  }

  public get peerContractAddress(): string | undefined {
    return this.data.peerContractAddress;
  }

  public get peerContract(): DepositContractConfig | undefined {
    if (this.peerChainId && this.peerContractAddress) {
      return this.auxDataNotEmpty.depositContractGetter(this.peerChainId, this.peerContractAddress);
    }
    return undefined;
  }

  public get bridgeFeeAsset(): AssetConfig {
    return this.bridgeFeeAssetConfig || this.auxDataNotEmpty.mainAssetConfig;
  }

  public get executorFeeAsset(): AssetConfig {
    return this.executorFeeAssetConfig || this.asset;
  }

  public get serviceFee(): number {
    return this.data.serviceFee;
  }

  public get serviceFeeDivider(): number {
    return this.data.serviceFeeDivider;
  }

  public mutate(data?: RawDepositContractConfig, auxData?: AuxData): DepositContractConfig {
    return new DepositContractConfig(data || this.data, auxData || this.auxData);
  }

  private validate() {
    check(
      this.maxAmount.gte(this.minAmount),
      `deposit contract=${this.address} maxAmount is less than minAmount`,
    );
    if (this.bridgeType === BridgeType.LOOP) {
      check(
        !this.peerChainId,
        `deposit contract=${this.address} peerChainId should be undefined ` +
          `when bridge type=${this.bridgeType}`,
      );
      check(
        !this.peerContractAddress,
        `deposit contract=${this.address} peerContractAddress should be undefined ` +
          `when bridge type=${this.bridgeType}`,
      );
    } else {
      check(
        !!this.peerChainId,
        `deposit contract=${this.address} peerChainId should not be undefined ` +
          `when bridge type=${this.bridgeType}`,
      );
      check(
        !!this.peerContractAddress,
        `deposit contract=${this.address} peerContractAddress should not be undefined ` +
          `when bridge type=${this.bridgeType}`,
      );
    }
    if (this.disabledAt) {
      check(
        this.disabledAt > this.startBlock,
        `deposit contract=${this.address} disabledAt should be greater than startBlock`,
      );
    }
  }

  private initBridgeFeeAssetConfig(assetConfigs: Map<string, AssetConfig>): AssetConfig | undefined {
    if (this.data.bridgeFeeAssetAddress) {
      if (this.data.bridgeFeeAssetAddress === MAIN_ASSET_ADDRESS) {
        return this.auxDataNotEmpty.mainAssetConfig;
      }
      const assetConfig = assetConfigs.get(this.data.bridgeFeeAssetAddress);
      if (!assetConfig) {
        throw new Error(
          `bridge fee asset address=${this.data.bridgeFeeAssetAddress} config ` +
            `has not been defined for deposit contract address=${this.data.address}`,
        );
      }
      return assetConfig;
    }
    return undefined;
  }

  private initExecutorFeeAssetConfig(assetConfigs: Map<string, AssetConfig>): AssetConfig | undefined {
    if (this.data.executorFeeAssetAddress) {
      if (this.data.executorFeeAssetAddress === MAIN_ASSET_ADDRESS) {
        return this.auxDataNotEmpty.mainAssetConfig;
      }
      const assetConfig = assetConfigs.get(this.data.executorFeeAssetAddress);
      if (!assetConfig) {
        throw new Error(
          `executor fee asset address=${this.data.executorFeeAssetAddress} config ` +
            `has not been defined for deposit contract address=${this.data.address}`,
        );
      }
      return assetConfig;
    }
    return undefined;
  }
}
