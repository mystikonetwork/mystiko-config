import { RawCelerBridgeConfig } from '../../raw';
import { BridgeConfig } from './base';

export class CelerBridgeConfig extends BridgeConfig<RawCelerBridgeConfig> {
  public mutate(data?: RawCelerBridgeConfig): CelerBridgeConfig {
    return new CelerBridgeConfig(data || this.data);
  }
}
