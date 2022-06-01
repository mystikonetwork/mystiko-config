import {RawTBridgeConfig} from '../../raw';
import {BridgeConfig} from './base';

export class TBridgeConfig extends BridgeConfig<RawTBridgeConfig> {
  public mutate(data?: RawTBridgeConfig): TBridgeConfig {
    return new TBridgeConfig(data || this.data);
  }
}
