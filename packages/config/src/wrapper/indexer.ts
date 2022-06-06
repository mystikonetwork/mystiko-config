import { RawIndexerConfig } from '../raw';
import { BaseConfig } from './base';

export class IndexerConfig extends BaseConfig<RawIndexerConfig> {
  public get url(): string {
    return this.data.url;
  }

  public get timeoutMs(): number {
    return this.data.timeoutMs;
  }

  public mutate(data?: RawIndexerConfig): IndexerConfig {
    return new IndexerConfig(data || this.data);
  }
}
