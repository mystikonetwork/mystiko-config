import { BridgeConfig } from './base';
import { RawLayerZeroBridgeConfig } from '../../raw';

export class LayerZeroBridgeConfig extends BridgeConfig<RawLayerZeroBridgeConfig> {
  public mutate(data?: RawLayerZeroBridgeConfig): LayerZeroBridgeConfig {
    return new LayerZeroBridgeConfig(data || this.data);
  }
}
