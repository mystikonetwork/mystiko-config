import { check } from '@mystikonetwork/utils';
import BN from 'bn.js';
import { AssetType, BridgeType, CircuitType, ProviderType } from '../common';
import { EXPLORER_TX_PLACEHOLDER, RawAssetConfig, RawChainConfig } from '../raw';
import { AssetConfig, MAIN_ASSET_ADDRESS } from './asset';
import { BaseConfig } from './base';
import { CircuitConfig } from './circuit';
import { DepositContractConfig, PoolContractConfig } from './contract';
import { ProviderConfig } from './provider';

type AuxData = {
  defaultCircuitConfigs: Map<CircuitType, CircuitConfig>;
  circuitConfigsByName: Map<string, CircuitConfig>;
  depositContractGetter: (chainId: number, address: string) => DepositContractConfig | undefined;
};

export class ChainConfig extends BaseConfig<RawChainConfig, AuxData> {
  private readonly poolContractConfigs: Map<string, PoolContractConfig>;

  private readonly poolConfigsByAssetAndBridge: Map<string, Map<BridgeType, Map<number, PoolContractConfig>>>;

  private readonly depositContractConfigs: Map<string, DepositContractConfig>;

  private readonly mainAssetConfig: AssetConfig;

  private readonly assetConfigs: Map<string, AssetConfig>;

  private readonly providerConfigs: ProviderConfig[];

  private readonly sortedPackerGranularities: number[];

  constructor(data: RawChainConfig, auxData?: AuxData) {
    super(data, auxData);
    this.mainAssetConfig = this.initMainAssetConfig();
    this.assetConfigs = this.initAssetConfigs();
    this.poolContractConfigs = this.initPoolContractConfigs(
      this.auxDataNotEmpty.defaultCircuitConfigs,
      this.auxDataNotEmpty.circuitConfigsByName,
    );
    this.depositContractConfigs = this.initDepositContractConfigs(
      this.poolContractConfigs,
      this.auxDataNotEmpty.depositContractGetter,
    );
    this.poolConfigsByAssetAndBridge = this.initPoolConfigsByAssetAndBridge();
    this.providerConfigs = this.data.providers.map((raw) => new ProviderConfig(raw));
    this.sortedPackerGranularities = data.packerGranularities.sort((a, b) => a - b);
  }

  public get chainId(): number {
    return this.data.chainId;
  }

  public get name(): string {
    return this.data.name;
  }

  public get assetSymbol(): string {
    return this.mainAssetConfig.assetSymbol;
  }

  public get assetSymbolAlias(): string[] {
    return this.mainAssetConfig.assetSymbolAlias;
  }

  public get assetDecimals(): number {
    return this.mainAssetConfig.assetDecimals;
  }

  public get recommendedAmounts(): BN[] {
    return this.mainAssetConfig.recommendedAmounts;
  }

  public get recommendedAmountsNumber(): number[] {
    return this.mainAssetConfig.recommendedAmountsNumber;
  }

  public get explorerUrl(): string {
    return this.data.explorerUrl;
  }

  public get explorerApiUrl(): string {
    return this.data.explorerApiUrl;
  }

  public get explorerPrefix(): string {
    return this.data.explorerPrefix;
  }

  public get providers(): Array<ProviderConfig> {
    return this.providerConfigs;
  }

  public get providerType(): ProviderType {
    return this.data.providerType;
  }

  public get providerQuorumPercentage(): number {
    return this.data.providerQuorumPercentage;
  }

  public get signerEndpoint(): string {
    return this.data.signerEndpoint;
  }

  public get eventDelayBlocks(): number {
    return this.data.eventDelayBlocks;
  }

  public get eventFilterSize(): number {
    return this.data.eventFilterSize;
  }

  public get indexerFilterSize(): number {
    return this.data.indexerFilterSize;
  }

  public get sequencerFetchSize(): number {
    return this.data.sequencerFetchSize;
  }

  public get safeConfirmations(): number | undefined {
    return this.data.safeConfirmations;
  }

  public get poolContracts(): PoolContractConfig[] {
    return Array.from(this.poolContractConfigs.values());
  }

  public get depositContracts(): DepositContractConfig[] {
    return Array.from(this.depositContractConfigs.values());
  }

  public get depositContractsWithoutDisabled(): DepositContractConfig[] {
    return this.depositContracts.filter((conf) => !conf.disabled);
  }

  public get assets(): AssetConfig[] {
    return Array.from(this.assetConfigs.values());
  }

  public get granularities(): number[] {
    return this.sortedPackerGranularities;
  }

  public get minGranularity(): number {
    return this.sortedPackerGranularities[0];
  }

  public get startBlock(): number {
    const startBlocks = [
      ...this.poolContracts.map((config) => config.startBlock),
      ...this.depositContracts.map((config) => config.startBlock),
    ];
    return startBlocks.length === 0 ? 0 : Math.min(...startBlocks);
  }

  public get peerChainIds(): number[] {
    const chainIds = new Set<number>();
    this.depositContractsWithoutDisabled.forEach((depositContractConfig) => {
      if (depositContractConfig.bridgeType === BridgeType.LOOP) {
        chainIds.add(this.chainId);
      } else if (depositContractConfig.peerChainId) {
        chainIds.add(depositContractConfig.peerChainId);
      }
    });
    return Array.from(chainIds);
  }

  public getAssetSymbols(peerChainId: number): string[] {
    const assetSymbols: Set<string> = new Set<string>();
    this.depositContractsWithoutDisabled.forEach((depositContractConfig) => {
      if (peerChainId === this.chainId) {
        if (depositContractConfig.bridgeType === BridgeType.LOOP) {
          assetSymbols.add(depositContractConfig.assetSymbol);
        }
      } else if (depositContractConfig.bridgeType !== BridgeType.LOOP) {
        if (peerChainId === depositContractConfig.peerChainId) {
          assetSymbols.add(depositContractConfig.assetSymbol);
        }
      }
    });
    return Array.from(assetSymbols);
  }

  public getBridges(peerChainId: number, assetSymbol: string): BridgeType[] {
    const bridges: Set<BridgeType> = new Set<BridgeType>();
    this.depositContractsWithoutDisabled.forEach((depositContractConfig) => {
      if (peerChainId !== this.chainId && depositContractConfig.assetSymbol === assetSymbol) {
        if (peerChainId === depositContractConfig.peerChainId) {
          bridges.add(depositContractConfig.bridgeType);
        }
      }
    });
    return Array.from(bridges);
  }

  public getDepositContract(
    peerChainId: number,
    assetSymbol: string,
    bridgeType: BridgeType,
  ): DepositContractConfig | undefined {
    const { depositContractsWithoutDisabled } = this;
    for (let i = 0; i < depositContractsWithoutDisabled.length; i += 1) {
      const depositContractConfig = depositContractsWithoutDisabled[i];
      if (
        depositContractConfig.assetSymbol === assetSymbol &&
        depositContractConfig.bridgeType === bridgeType
      ) {
        if (peerChainId === this.chainId && bridgeType === BridgeType.LOOP) {
          return depositContractConfig;
        }
        if (peerChainId === depositContractConfig.peerChainId && bridgeType !== BridgeType.LOOP) {
          return depositContractConfig;
        }
      }
    }
    return undefined;
  }

  public getPoolContract(
    assetSymbol: string,
    bridgeType: BridgeType,
    version: number,
  ): PoolContractConfig | undefined {
    return this.poolConfigsByAssetAndBridge.get(assetSymbol)?.get(bridgeType)?.get(version);
  }

  public getPoolContracts(assetSymbol: string, bridgeType: BridgeType): PoolContractConfig[] {
    const allVersions = this.poolConfigsByAssetAndBridge.get(assetSymbol)?.get(bridgeType);
    return allVersions ? Array.from(allVersions.values()) : [];
  }

  public getDepositContractByAddress(address: string): DepositContractConfig | undefined {
    return this.depositContractConfigs.get(address);
  }

  public getPoolContractByAddress(address: string): PoolContractConfig | undefined {
    return this.poolContractConfigs.get(address);
  }

  public getPoolContractBridgeType(address: string): BridgeType | undefined {
    return this.getPoolContractByAddress(address)?.bridgeType;
  }

  public getEventFilterSizeByAddress(address: string): number {
    const depositContractConfig = this.depositContractConfigs.get(address);
    if (depositContractConfig) {
      return depositContractConfig.eventFilterSize || this.eventFilterSize;
    }
    return this.getPoolContractByAddress(address)?.eventFilterSize || this.eventFilterSize;
  }

  public getIndexerFilterSizeByAddress(address: string): number {
    const depositContractConfig = this.depositContractConfigs.get(address);
    if (depositContractConfig) {
      return depositContractConfig.indexerFilterSize || this.indexerFilterSize;
    }
    return this.getPoolContractByAddress(address)?.indexerFilterSize || this.indexerFilterSize;
  }

  public getAssetConfigByAddress(assetAddress: string): AssetConfig | undefined {
    return this.assetConfigs.get(assetAddress);
  }

  public getTransactionUrl(transactionHash: string): string {
    return `${this.explorerUrl}${this.explorerPrefix}`.replace(EXPLORER_TX_PLACEHOLDER, transactionHash);
  }

  public mutate(data?: RawChainConfig, auxData?: AuxData): ChainConfig {
    return new ChainConfig(data || this.data, auxData || this.auxData);
  }

  private initPoolContractConfigs(
    defaultCircuitConfigs: Map<CircuitType, CircuitConfig>,
    circuitConfigsByName: Map<string, CircuitConfig>,
  ): Map<string, PoolContractConfig> {
    const poolContractConfigs = new Map<string, PoolContractConfig>();
    this.data.poolContracts.forEach((raw) => {
      check(
        !poolContractConfigs.has(raw.address),
        `duplicate pool contract=${raw.address} definition in configuration`,
      );
      poolContractConfigs.set(
        raw.address,
        new PoolContractConfig(raw, {
          defaultCircuitConfigs,
          circuitConfigsByName,
          mainAssetConfig: this.mainAssetConfig,
          assetConfigs: this.assetConfigs,
        }),
      );
    });
    return poolContractConfigs;
  }

  private initDepositContractConfigs(
    poolContractConfigs: Map<string, PoolContractConfig>,
    depositContractGetter: (chainId: number, address: string) => DepositContractConfig | undefined,
  ): Map<string, DepositContractConfig> {
    const depositContractConfigs = new Map<string, DepositContractConfig>();
    this.data.depositContracts.forEach((raw) => {
      check(
        !depositContractConfigs.has(raw.address),
        `duplicate deposit contract=${raw.address} definition in configuration`,
      );
      const poolContractConfig = poolContractConfigs.get(raw.poolAddress);
      if (!poolContractConfig) {
        throw new Error(`deposit contract=${raw.address} poolAddress definition does not exist`);
      }
      check(
        raw.bridgeType === poolContractConfig.bridgeType,
        `deposit contract=${raw.address} bridgeType=${raw.bridgeType} ` +
          `does not equal to pool contract bridgeType=${poolContractConfig.bridgeType}`,
      );
      if (raw.bridgeType !== BridgeType.LOOP) {
        check(
          this.chainId !== raw.peerChainId,
          `current chain id should be different with peer chain id in contract=${raw.address}`,
        );
      }
      depositContractConfigs.set(
        raw.address,
        new DepositContractConfig(raw, {
          poolContractGetter: (address) => this.getPoolContractByAddress(address),
          depositContractGetter,
          mainAssetConfig: this.mainAssetConfig,
          assetConfigs: this.assetConfigs,
        }),
      );
    });
    return depositContractConfigs;
  }

  private initPoolConfigsByAssetAndBridge(): Map<string, Map<BridgeType, Map<number, PoolContractConfig>>> {
    const poolConfigsByAssetAndBridge = new Map<string, Map<BridgeType, Map<number, PoolContractConfig>>>();
    this.poolContracts.forEach((poolContractConfig) => {
      const bridges: Map<BridgeType, Map<number, PoolContractConfig>> = poolConfigsByAssetAndBridge.get(
        poolContractConfig.assetSymbol,
      ) || new Map<BridgeType, Map<number, PoolContractConfig>>();
      const allVersions = bridges.get(poolContractConfig.bridgeType) || new Map<number, PoolContractConfig>();
      check(
        !allVersions.has(poolContractConfig.version),
        `only one pool address allowed for asset ${poolContractConfig.assetSymbol} ` +
          `and bridge type ${poolContractConfig.bridgeType} and version ${poolContractConfig.version}`,
      );
      allVersions.set(poolContractConfig.version, poolContractConfig);
      bridges.set(poolContractConfig.bridgeType, allVersions);
      poolConfigsByAssetAndBridge.set(poolContractConfig.assetSymbol, bridges);
      poolContractConfig.assetSymbolAlias.forEach((assetSymbolAlias) => {
        poolConfigsByAssetAndBridge.set(assetSymbolAlias, bridges);
      });
    });
    return poolConfigsByAssetAndBridge;
  }

  private initMainAssetConfig(): AssetConfig {
    return new AssetConfig({
      assetType: AssetType.MAIN,
      assetSymbol: this.data.assetSymbol,
      assetDecimals: this.data.assetDecimals,
      assetSymbolAlias: this.data.assetSymbolAlias,
      assetAddress: MAIN_ASSET_ADDRESS,
      recommendedAmounts: this.data.recommendedAmounts,
    } as RawAssetConfig);
  }

  private initAssetConfigs(): Map<string, AssetConfig> {
    const assetConfigs = new Map<string, AssetConfig>();
    this.data.assets.forEach((assetConfig) => {
      assetConfigs.set(assetConfig.assetAddress, new AssetConfig(assetConfig));
    });
    return assetConfigs;
  }
}
