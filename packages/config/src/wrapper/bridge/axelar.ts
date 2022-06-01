import { BridgeConfig } from './base';
import {RawAxelarBridgeConfig} from '../../raw';

export class AxelarBridgeConfig extends BridgeConfig<RawAxelarBridgeConfig> {
  public mutate(data?: RawAxelarBridgeConfig): AxelarBridgeConfig {
    return new AxelarBridgeConfig(data || this.data);
  }
}
