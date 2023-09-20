import { PackerChecksum, PackerCompression } from '../common';
import { RawPackerConfig } from '../raw';
import { BaseConfig } from './base';

export class PackerConfig extends BaseConfig<RawPackerConfig> {
  public get url(): string {
    return this.data.url;
  }

  public get clientTimeoutMs(): number {
    return this.data.clientTimeoutMs;
  }

  public get version(): number {
    return this.data.version;
  }

  public get checksum(): PackerChecksum {
    return this.data.checksum;
  }

  public get compression(): PackerCompression {
    return this.data.compression;
  }

  public mutate(data?: RawPackerConfig): PackerConfig {
    return new PackerConfig(data || this.data);
  }
}
