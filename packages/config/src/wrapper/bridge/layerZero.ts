import { RawLayerZeroBridgeConfig } from '../../raw';
import { BridgeConfig } from './base';

export class LayerZeroBridgeConfig extends BridgeConfig<RawLayerZeroBridgeConfig> {
  public mutate(data?: RawLayerZeroBridgeConfig): LayerZeroBridgeConfig {
    return new LayerZeroBridgeConfig(data || this.data);
  }
}
