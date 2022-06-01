import {RawAxelarBridgeConfig} from '../../raw';
import {BridgeConfig} from './base';

export class AxelarBridgeConfig extends BridgeConfig<RawAxelarBridgeConfig> {
  public mutate(data?: RawAxelarBridgeConfig): AxelarBridgeConfig {
    return new AxelarBridgeConfig(data || this.data);
  }
}
