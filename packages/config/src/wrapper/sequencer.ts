import { RawSequencerConfig } from '../raw';
import { BaseConfig } from './base';

export class SequencerConfig extends BaseConfig<RawSequencerConfig> {
  public get host(): string {
    return this.data.host;
  }

  public get port(): number | undefined {
    return this.data.port;
  }

  public get isSsl(): boolean | undefined {
    return this.data.isSsl;
  }

  public mutate(data?: RawSequencerConfig): SequencerConfig {
    return new SequencerConfig(data || this.data);
  }
}
