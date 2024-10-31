import { RawWormholeBridgeConfig } from '../../raw';
import { BridgeConfig } from './base';

export class WormholeBridgeConfig extends BridgeConfig<RawWormholeBridgeConfig> {
  public mutate(data?: RawWormholeBridgeConfig): WormholeBridgeConfig {
    return new WormholeBridgeConfig(data || this.data);
  }
}
