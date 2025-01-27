import { ContractType } from '../../common';
import { RawContractConfig } from '../../raw';
import { BaseConfig } from '../base';

export class ContractConfig<T extends RawContractConfig, A = {}> extends BaseConfig<T, A> {
  public get version(): number {
    return this.data.version;
  }

  public get name(): string {
    return this.data.name;
  }

  public get address(): string {
    return this.data.address;
  }

  public get type(): ContractType {
    return this.data.type;
  }

  public get startBlock(): number {
    return this.data.startBlock;
  }

  public get eventFilterSize(): number | undefined {
    return this.data.eventFilterSize;
  }

  public get indexerFilterSize(): number | undefined {
    return this.data.indexerFilterSize;
  }

  public get disabledAt(): number | undefined {
    return this.data.disabledAt;
  }

  public get disabled(): boolean {
    return !!this.disabledAt;
  }

  public mutate(data?: T, auxData?: A): ContractConfig<T, A> {
    return new ContractConfig<T, A>(data || this.data, auxData || this.auxData);
  }
}
