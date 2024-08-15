import { RawScreeningConfig } from '../raw';
import { BaseConfig } from './base';

export class ScreeningConfig extends BaseConfig<RawScreeningConfig> {
  public get url(): string {
    return this.data.url;
  }

  public get clientTimeoutMs(): number {
    return this.data.clientTimeoutMs;
  }

  public get version(): number {
    return this.data.version;
  }

  public static default(): ScreeningConfig {
    const defaultData = new RawScreeningConfig();
    return new ScreeningConfig(defaultData);
  }

  public mutate(data?: RawScreeningConfig): ScreeningConfig {
    return new ScreeningConfig(data || this.data);
  }
}
