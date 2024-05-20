import { CircuitType } from '../common';
import { RawCircuitConfig } from '../raw';
import { BaseConfig } from './base';

export class CircuitConfig extends BaseConfig<RawCircuitConfig> {
  public get name(): string {
    return this.data.name;
  }

  public get type(): CircuitType {
    return this.data.type;
  }

  public get isDefault(): boolean {
    return this.data.isDefault;
  }

  public get programFile(): string[] {
    return this.data.programFile;
  }

  public get programFileChecksum(): string | undefined {
    return this.data.programFileChecksum;
  }

  public get abiFile(): string[] {
    return this.data.abiFile;
  }

  public get abiFileChecksum(): string | undefined {
    return this.data.abiFileChecksum;
  }

  public get provingKeyFile(): string[] {
    return this.data.provingKeyFile;
  }

  public get provingKeyFileChecksum(): string | undefined {
    return this.data.provingKeyFileChecksum;
  }

  public get verifyingKeyFile(): string[] {
    return this.data.verifyingKeyFile;
  }

  public get verifyingKeyFileChecksum(): string | undefined {
    return this.data.verifyingKeyFileChecksum;
  }

  public mutate(data?: RawCircuitConfig): CircuitConfig {
    return new CircuitConfig(data || this.data);
  }
}
